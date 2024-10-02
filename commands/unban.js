const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const db = require('../fonctions/database.js');

module.exports = {
    name: "unban",
    description: "Revoque le bannissement d'un membre.",
    aliases: [],
    permissions: [PermissionsBitField.Flags.BanMembers],
    guildOwnerOnly: false,
    botOwnerOnly: false,

    async execute(client, message, args) {

        if (!args[0]) return message.channel.send({ content: `<a:protect:1290717554544742440> Veuillez mentionner un membre !` });

        const member = message.mentions.members.first()?.id || args[0]
        console.log(member)

        if (!member) return message.channel.send({ content: `<a:protect:1290717554544742440> Veuillez mentionner un membre du serveur !` });

        message.guild.members.unban(member, { reason: `Debannis par ${message.author.tag}` })
        message.channel.send(`<a:protect:1290717554544742440> <@${member}> est bien unbanni !`)
    },
    async executeSlash(client, interaction) {
        const member = interaction.options.getUser('membre');
        if (!member) return interaction.channel.send({ content: `<a:protect:1290717554544742440> Veuillez mentionner un vrai membre !` });
        interaction.guild.members.unban(member.id, { reason: `Debannis par ${interaction.user.tag}` });
        interaction.reply(`<a:protect:1290717554544742440> <@${member.id}> est bien unbanni !`)
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(option =>
                option.setName('membre')
                    .setDescription('Membre a unban')
                    .setRequired(true)
            )
            .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    }
}
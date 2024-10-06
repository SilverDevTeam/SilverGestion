const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const db = require('../fonctions/database.js');

module.exports = {
    name: "ban",
    description: "Ban un membre.",
    aliases: [],
    permissions: [PermissionsBitField.Flags.BanMembers],
    guildOwnerOnly: false,
    botOwnerOnly: false,

    async execute(client, message, args) {

        if (!args[0]) return message.channel.send({ content: `<a:protect:1290717554544742440> Veuillez mentionner un membre !` });
        if (!args[1]) return message.channel.send({ content: `<a:protect:1290717554544742440> Veuillez préciser une raison !` });
        let reason = 'pour: '
        for (let i = 1; i < args.length; i++) {
            reason += args[i] + ' '
        }

        const member = message.mentions.members.first() ?? message.guild.members.cache.get(args[0])

        if (!member) return message.channel.send({ content: `<a:protect:1290717554544742440> Veuillez mentionner un membre du serveur !` });

        if (member.id === message.author.id)
            return message.channel.send({ content: `<a:protect:1290717554544742440> Vous ne pouvez pas vous auto-ban !` });

        if (member.roles.highest.position >= message.member.roles.highest.position) {
            return message.channel.send({
                content: `<a:protect:1290717554544742440> Vous ne pouvez pas ban un membre qui a un rôle plus haut que vous !`
            });
        }

        member.send(`**Banni(e)** du serveur ${message.guild.name} - ${reason}`)
            .then(() => {
                try {
                    message.guild.members.ban(member.id, { reason: `Bannis par ${message.author.tag} - ${reason}` })
                    message.channel.send(`<a:protect:1290717554544742440> <@${member.id}> est bien banni !`)
                }
                catch {
                    return message.channel.send(`<a:protect:1290717554544742440> Je n'arrive pas a bannir <@${member.id}>, veuillez verifier mon placement dans les roles et mes permission !`)
                }
            })
    },
    async executeSlash(client, interaction) {
        const member = interaction.options.getUser('membre');
        const reason = interaction.options.getString('raison');
  
        member.send(`**Banni(e)** du serveur ${interaction.guild.name} - ${reason}`)
            .then(() => {
                try {
                    interaction.guild.members.ban(member.id, { reason: `Bannis par ${interaction.user.tag} - pour: ${reason}` });
                    interaction.reply(`<a:protect:1290717554544742440> <@${member.id}> est bien banni !`)
                }
                catch {
                    return interaction.reply(`<a:protect:1290717554544742440> Je n'arrive pas a bannir <@${member.id}>, veuillez verifier mon placement dans les roles et mes permission !`)
                }
            })
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(option =>
                option.setName('membre')
                    .setDescription('Membre a bannir')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option.setName('raison')
                    .setDescription('La raison du bannissement.')
                    .setMinLength(3)
                    .setRequired(true)
            )
            .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    }
}
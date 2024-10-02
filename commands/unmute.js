const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const db = require('../fonctions/database.js');

module.exports = {
    name: "unmute",
    description: "Annuler la reduction au silence d'un membre.",
    aliases: ['unmuet', 'untimeout', 'un-mute', 'un-muet', 'un-timeout'],
    permissions: [PermissionsBitField.Flags.ModerateMembers],
    guildOwnerOnly: false,
    botOwnerOnly: false,

    async execute(client, message, args) {
        const member = message.mentions.members.first() ?? message.guild.members.cache.get(args[0])
        if (!member) {
            const msg = await message.channel.send(`<a:protect:1290717554544742440> Veuillez envoyer : \`${client.config.prefix}unmute <membre>\`.`)
            setTimeout(() => {
                msg.delete()
            }, 30000);
            return
        }

        try {
            member.timeout(null)
            message.channel.send(`<a:protect:1290717554544742440> <@${member.id}> est bien unmute !`)
        } catch {
            const msg = await message.channel.send(`<a:protect:1290717554544742440> Je n'arrive pas a unmute <@${member.id}>, veuillez verifier mon placement dans les roles et mes permission !`)
            setTimeout(() => {
                msg.delete()
            }, 30000);
            return
        }

        try {
            const embedunmute = new EmbedBuilder()
                .setColor('Green')
                .setTitle('Unmute')
                .setDescription(`Il semblerait que vous ne soyer plus unmute sur le serveur **${message.guild.name}**`)
                .addFields({ name: 'Serveur :', value: message.guild.name, inline: true })
            member.send({ embeds: [embedunmute] })
        } catch {
            return
        }


    },
    async executeSlash(client, interaction) {
        let member = interaction.options.getUser('membre');
        member = interaction.guild.members.cache.get(member.id)

        try {
            member.timeout(null)
            interaction.reply(`<a:protect:1290717554544742440> <@${member.id}> est bien unmute !`)
        } catch {
            return interaction.reply(`<a:protect:1290717554544742440> Je n'arrive pas a unmute <@${member.id}>, veuillez verifier mon placement dans les roles et mes permission !`)
        }

        try {
            const embedUnMute = new EmbedBuilder()
                .setColor('Green')
                .setTitle('Unmute')
                .setDescription(`Il semblerait que vous ne soyer plus unmute sur le serveur **${interaction.guild.name}**`)
                .addFields({ name: 'Serveur :', value: interaction.guild.name, inline: true })
            member.send({ embeds: [embedUnMute] })
        } catch {
            return
        }

    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(option =>
                option.setName('membre')
                    .setDescription('Membre à unmute')
                    .setRequired(true)
            )
            .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    }
}
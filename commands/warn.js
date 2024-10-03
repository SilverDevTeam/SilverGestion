const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const db = require('../fonctions/database.js');

module.exports = {
    name: "warn",
    description: "Avertir un membre.",
    aliases: ['warn', 'avertir', 'attention', 'warning'],
    permissions: [PermissionsBitField.Flags.ModerateMembers],
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

        if (member.id === message.author.id) return message.channel.send({ content: `<a:protect:1290717554544742440> Vous ne pouvez pas vous auto-avertir !` });

        if ((member.roles.highest.position >= message.member.roles.highest.position) || (message.guild.ownerId == member.id)) {
            return message.channel.send({
                content: `<a:protect:1290717554544742440> Vous ne pouvez pas avertir un membre qui a un rôle plus haut que vous !`
            });
        }
        member.send(`**Avertissement reçu** sur le serveur ${message.guild.name} - ${reason}`).catch()
            .then(async () => {
                try {
                    db.run(`INSERT INTO sanction (guildId, userId, reason) VALUES(?, ?, ?)`, [message.guild.id, member.id, reason])
                    message.channel.send(`<a:protect:1290717554544742440> <@${member.id}> est bien averti(e) !`)
                }
                catch {
                    return message.channel.send(`<a:protect:1290717554544742440> Je n'arrive pas a avertir <@${member.id}>, veuillez verifier mon placement dans les roles et mes permission !`)
                }
            })
    },
    async executeSlash(client, interaction) {
        const member = interaction.options.getUser('membre');
        const reason = interaction.options.getString('raison');

        
        member.send(`**Avertissement reçu** sur le serveur ${interaction.guild.name} - ${reason}`).catch()
            .then(() => {
                try {
                    db.run(`INSERT INTO sanction (guildId, userId, reason) VALUES(?, ?, ?)`, [interaction.guild.id, member.id, reason])
                    interaction.reply(`<a:protect:1290717554544742440> <@${member.id}> est bien averti(e) !`)
                }
                catch {
                    return interaction.reply(`<a:protect:1290717554544742440> Je n'arrive pas a avertir <@${member.id}>, veuillez verifier mon placement dans les roles et mes permission !`)
                }
            })
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(option =>
                option.setName('membre')
                    .setDescription('Membre a avertir')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option.setName('raison')
                    .setDescription('La raison de l\'avertissement.')
                    .setMinLength(3)
                    .setRequired(true)
            )
            .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    }
}
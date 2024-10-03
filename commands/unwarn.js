const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const db = require('../fonctions/database.js');

module.exports = {
    name: "unwarn",
    description: "Supprimer l'avertissement un membre.",
    aliases: ['desavertir'],
    permissions: [PermissionsBitField.Flags.KickMembers],
    guildOwnerOnly: false,
    botOwnerOnly: false,

    async execute(client, message, args) {

        if (!args[0]) return message.channel.send({ content: `<a:protect:1290717554544742440> Veuillez mentionner un membre !` });
        if (!args[1] || isNaN(args[1])) return message.channel.send({ content: `<a:protect:1290717554544742440> Veuillez préciser l'ID !` });
        const ID = args[1]

        const member = message.mentions.members.first() ?? message.guild.members.cache.get(args[0])

        if (!member) return message.channel.send({ content: `<a:protect:1290717554544742440> Veuillez mentionner un membre du serveur !` });

        if (member.id === message.author.id) return message.channel.send({ content: `<a:protect:1290717554544742440> Vous ne pouvez pas vous auto-desavertir !` });

        if ((member.roles.highest.position >= message.member.roles.highest.position) || (message.guild.ownerId == member.id)) {
            return message.channel.send({
                content: `<a:protect:1290717554544742440> Vous ne pouvez pas supprimer l'avertissement un membre qui a un rôle plus haut que vous !`
            });
        }
        member.send(`**Avertissement supprimé** sur le serveur ${message.guild.name} - ID: ${ID}`).catch()
            .then(async () => {
                try {
                    db.run(
                        `DELETE FROM sanction WHERE guildId = ? AND ID = ?`,
                        [message.guild.id, ID],
                    );
                    message.channel.send(`<a:protect:1290717554544742440> L'avertissement de <@${member.id}> avec l'ID ${ID} est bien supprimé !`)
                }
                catch {
                    return message.channel.send(`<a:protect:1290717554544742440> Je n'arrive pas a desavertir <@${member.id}>, veuillez verifier mon placement dans les roles et mes permission !`)
                }
            })
    },
    async executeSlash(client, interaction) {
        const member = interaction.options.getUser('membre');
        const ID = interaction.options.getNumber('id');


        member.send(`**Avertissement supprimé** sur le serveur ${interaction.guild.name} - ID: ${ID}`).catch()
            .then(() => {
                try {
                    db.run(
                        `DELETE FROM sanction WHERE guildId = ? AND ID = ?`,
                        [interaction.guild.id, ID],
                    );
                    interaction.reply(`<a:protect:1290717554544742440> L'avertissement de <@${member.id}> avec l'ID ${ID} est bien supprimé !`)
                }
                catch {
                    return interaction.reply(`<a:protect:1290717554544742440> Je n'arrive pas a desavertir <@${member.id}>, veuillez verifier mon placement dans les roles et mes permission !`)
                }
            })
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(option =>
                option.setName('membre')
                    .setDescription('Membre a qui appartient l\'avertissement')
                    .setRequired(true)
            )
            .addNumberOption(option =>
                option.setName('id')
                    .setDescription('ID de l\'avertissement')
                    .setRequired(true)
            )
            .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    }
}
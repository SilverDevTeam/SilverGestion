const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, embedLength } = require('discord.js');
const db = require('../fonctions/database.js');

module.exports = {
    name: "warnlist",
    description: "Liste des avertissement.",
    aliases: ['avertissementlist', 'avertissement-list', 'avertissementliste', 'avertissement-liste', 'warn-list', 'warnliste', 'warn-liste'],
    permissions: [PermissionsBitField.Flags.ModerateMembers],
    guildOwnerOnly: false,
    botOwnerOnly: false,

    async execute(client, message, args) {

        const member = message.mentions.members.first() ?? message.guild.members.cache.get(args[0])
        let donnee
        if (member) {
            donnee = await new Promise((resolve, reject) => {
                db.all(
                    `SELECT ID, reason FROM sanction WHERE guildId = ${message.guild.id} AND userId = ${member.id} ORDER BY ID DESC`,
                    (err, rows) => {
                        if (err) reject(err);
                        resolve(rows);
                    },
                );
            });

            let list = donnee.map(async (row, i) => {
                let position;
                switch (i) {
                    default:
                        position = `**${i + 1}.**`;
                }
                return `${position} ID: \`${row.ID}\`\n${row.reason}`;
            });

            Promise.all(list).then(results => {
                const embed = new EmbedBuilder()
                    .setColor(client.config.color)
                    .setTimestamp()
                    .setTitle('Avertissement de ' + member.user.tag)
                    .setDescription(`Avertissement de ${member.user.tag}:\n ${results.join("\n\n")}`)
                message.channel.send({ embeds: [embed] })
            })
        } else {
            donnee = await new Promise((resolve, reject) => {
                db.all(
                    `SELECT ID, reason, userId FROM sanction WHERE guildId = ${message.guild.id} ORDER BY ID DESC`,
                    (err, rows) => {
                        if (err) reject(err);
                        resolve(rows);
                    },
                );
            });

            let list = donnee.map(async (row, i) => {
                let position;
                switch (i) {
                    default:
                        position = `**${i + 1}.**`;
                }
                return `${position} <@${row.userId}> - ID: \`${row.ID}\`\n${row.reason}`;
            });

            Promise.all(list).then(results => {
                const embed = new EmbedBuilder()
                    .setColor(client.config.color)
                    .setTimestamp()
                    .setTitle('Avertissement du serveur :')
                    .setDescription(`Liste des avertissement:\n ${results.join("\n\n")}`)
                message.channel.send({ embeds: [embed] })
            })
        }

    },
    async executeSlash(client, interaction) {
        const member = interaction.options.getUser('membre');
        if (member) {
            donnee = await new Promise((resolve, reject) => {
                db.all(
                    `SELECT ID, reason FROM sanction WHERE guildId = ${interaction.guild.id} AND userId = ${member.id} ORDER BY ID DESC`,
                    (err, rows) => {
                        if (err) reject(err);
                        resolve(rows);
                    },
                );
            });

            let list = donnee.map(async (row, i) => {
                let position;
                switch (i) {
                    default:
                        position = `**${i + 1}.**`;
                }
                return `${position} ID: \`${row.ID}\` \n${row.reason}`;
            });

            Promise.all(list).then(results => {
                const embed = new EmbedBuilder()
                    .setColor(client.config.color)
                    .setTimestamp()
                    .setTitle('Avertissement de ' + member.user.tag)
                    .setDescription(`Avertissement de ${member.user.tag}:\n ${results.join("\n\n")}`)
                interaction.reply({ embeds: [embed] })
            })
        } else {
            donnee = await new Promise((resolve, reject) => {
                db.all(
                    `SELECT ID, reason, userId FROM sanction WHERE guildId = ${interaction.guild.id} ORDER BY ID DESC`,
                    (err, rows) => {
                        if (err) reject(err);
                        resolve(rows);
                    },
                );
            });

            let list = donnee.map(async (row, i) => {
                let position;
                switch (i) {
                    default:
                        position = `**${i + 1}.**`;
                }
                return `${position} <@${row.userId}> - ID: \`${row.ID}\`\n${row.reason}`;
            });

            Promise.all(list).then(results => {
                const embed = new EmbedBuilder()
                    .setColor(client.config.color)
                    .setTimestamp()
                    .setTitle('Avertissement du serveur :')
                    .setDescription(`Liste des avertissement:\n ${results.join("\n\n")}`)
                interaction.channel.send({ embeds: [embed] })
            })
        }
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(option =>
                option.setName('membre')
                    .setDescription('Membre dont vous voulez la liste des avertissements')
                    .setRequired(false)
            )
            .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    }
}
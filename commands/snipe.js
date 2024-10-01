const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const db = require('../fonctions/database.js');

module.exports = {
    name: "snipe",
    description: "Afficher le dernier message suppimé.",
    aliases: [],
    permissions: [PermissionsBitField.Flags.UseApplicationCommands],
    guildOwnerOnly: false,
    botOwnerOnly: false,

    async execute(client, message, args) {
        const donnee = await new Promise((resolve, reject) => {
            db.get(`SELECT * FROM channels WHERE guildId = ? AND channelId = ?`, [message.guild.id, message.channel.id], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
        if (donnee.snipe == null) {
            const msg = await message.channel.send('> **<a:warning:1290717663001051207> Aucun message supprimé récemment.**')
            setTimeout(() => {
                msg.delete()
            }, 10000);
            return
        }
        const embed = new EmbedBuilder()
            .setTitle('Snipe :')
            .setColor(client.config.color)
            .setTimestamp()
            .setDescription(`
                __**Message :**__ ${donnee.snipe}
                
                __**Auteur :**__ <@${donnee.snipeAuthor}>
            `)
        message.channel.send({ embeds: [embed] })
    },
    async executeSlash(client, interaction) {
        const donnee = await new Promise((resolve, reject) => {
            db.get(`SELECT * FROM channels WHERE guildId = ? AND channelId = ?`, [interaction.guild.id, interaction.channel.id], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
        if (donnee.snipe == null) {
            const msg = await interaction.reply('> **<a:warning:1290717663001051207> Aucun message supprimé récemment.**')
            setTimeout(() => {
                msg.delete()
            }, 10000);
            return
        }
        const embed = new EmbedBuilder()
            .setTitle('Snipe :')
            .setColor(client.config.color)
            .setTimestamp()
            .setDescription(`
                __**Message :**__ ${donnee.snipe}
                
                __**Auteur :**__ <@${donnee.snipeAuthor}>
            `)
        interaction.reply({ embeds: [embed] })
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
    }
}
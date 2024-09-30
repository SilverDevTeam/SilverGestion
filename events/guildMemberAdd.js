const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")
const db = require("../fonctions/database.js");

module.exports = {
    name: 'guildMemberAdd',
    async execute(client, member) {
        db.run(`INSERT OR IGNORE INTO users (guildId, userId) VALUES (?, ?)`, [
            member.guild.id, member.id
        ]);
    }
}
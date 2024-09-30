const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")
const db = require("../fonctions/database.js");


module.exports = {
    name: 'guildCreate',
    async execute(client, guild) {
        db.run(
            `INSERT OR IGNORE INTO guilds (guildId) VALUES (?)`,
            [guild.id],
        );
        guild.members.cache.forEach((member) => {
            db.run(`INSERT OR IGNORE INTO users (guildId, userId) VALUES (?, ?)`, [
                guild.id,
                member.id,
            ]);
        })
        guild.channels.cache.forEach((channel) => {
            db.run(`INSERT OR IGNORE INTO channels (guildId, channelId) VALUES (?, ?)`, [
                guild.id,
                channel.id,
            ]);
            db.run(`INSERT OR IGNORE INTO logs (guildId, channelId) VALUES (?, ?)`, [
                guild.id,
                channel.id,
            ]);
        })

            client.channels.cache.get('1290053743403991153').send('<@&1289957584840687736> J\'ai été ajouté sur un serveur\n\n> <:verif:1262343660700434464> Il s\'appel ' + guild.name + '\n> <:member:1262160675686584414> Il possède ' + guild.memberCount + 'membres !!\n> <:boost:1262161795423015045> Le niveau de boost est ' + guild.premiumSubscriptionCount + '\n> <a:GoldenCrown:1279009086981148765> L\'owner de ce serveur est <@' + guild.ownerId + '> | `' + client.users.cache.get(guild.ownerId).username + '`\n_ _')
    }
}
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")
const db = require("../fonctions/database.js");


module.exports = {
    name: 'guildDelete',
    async execute(client, guild) {
        client.channels.cache.get('1290053743403991153').send('<@&1289957584840687736> J\'ai été retiré d\'un serveur :sob::rage:\n\n> <:verif:1262343660700434464> Il s\'appelle \`' + guild.name + '\`\n> <:member:1262160675686584414> Il possède ' + guild.memberCount + 'membres !!\n> <a:GoldenCrown:1279009086981148765> L\'owner de ce serveur est <@' + guild.ownerId + '> | `' + client.users.cache.get(guild.ownerId).username + '`\n_ _')
    }
}
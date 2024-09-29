const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, AttachmentBuilder } = require('discord.js');
const db = require('../fonctions/database.js');

module.exports = {
  name: "messageDelete",
  async execute(message, client) {
    /*if (message.channel.isDMBased() || message.author.bot) return;
    if (message.content.startsWith(client.config.prefix)) return;

    db.run(
      `UPDATE channels SET snipe = ?, snipeAuthor = ? WHERE guildId = ? AND channelId = ?`,
      [message.content, message.author.id, message.guild.id, message.channel.id],
    );*/
  }
};
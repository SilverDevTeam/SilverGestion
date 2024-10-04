const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, AttachmentBuilder } = require('discord.js');
const db = require('../fonctions/database.js');

module.exports = {
  name: "messageDelete",
  async execute(client, message) {
    try {
      if (message.channel.isDMBased()) return;
      if (message.author.bot) return;
      if (message.system) return;
      if (message.content.startsWith(client.config.prefix)) return;

      db.run(
        `UPDATE channels SET snipe = ?, snipeAuthor = ? WHERE guildId = ? AND channelId = ?`,
        [message.content, message.author.id, message.guild.id, message.channel.id],
      );
    }
    catch { }

    // LOGS
    const donnee = await new Promise((resolve, reject) => {
      db.get(`SELECT * FROM logs WHERE guildId = ?`, [message.guild.id], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
    if (donnee.logsmessage) {
      try {
        const embed = new EmbedBuilder()
          .setTitle(`Message supprimé`)
          .setDescription(`**Utilisateur : <@${message.author.id}> | \`${message.author.tag}\`**\nContenu du message :\n\n` + message.content)
          .setColor('Red')
          .setTimestamp()
          .setFooter({
            text: ` `,
            iconURL: client.user.displayAvatarURL(),
          });

        client.channels.cache.get(donnee.logsmessage).send({ embeds: [embed] })
      } catch { }
    }
  }
};
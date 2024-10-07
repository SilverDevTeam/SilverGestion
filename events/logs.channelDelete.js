const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, AttachmentBuilder } = require('discord.js');
const db = require('../fonctions/database.js');

module.exports = {
  name: "channelDelete",
  async execute(client, channel) {

    // LOGS
    const donnee = await new Promise((resolve, reject) => {
      db.get(`SELECT * FROM logs WHERE guildId = ?`, [channel.guild.id], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
    if (donnee.logsserveur) {
      try {
        const embed = new EmbedBuilder()
          .setTitle(`Salon supprimé`)
          .setDescription(`**Nom du salon : ${channel.name}**`)
          .setColor('Red')
          .setTimestamp()
          .setFooter({
            text: ` `,
            iconURL: client.user.displayAvatarURL(),
          });

        client.channels.cache.get(donnee.logsserveur).send({ embeds: [embed] })
      } catch { }
    }
  }
};
const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, AttachmentBuilder } = require('discord.js');
const db = require('../fonctions/database.js');

module.exports = {
  name: "channelCreate",
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
          .setTitle(`Salon créé`)
          .setDescription(`**Nom du salon : ${channel.name} -> [ICI](https://discord.com/channels/${channel.guild.id}/${channel.id})**`)
          .setColor('Green')
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
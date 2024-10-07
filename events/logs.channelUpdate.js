const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, AttachmentBuilder } = require('discord.js');
const db = require('../fonctions/database.js');

module.exports = {
  name: "channelUpdate",
  async execute(client, oldChannel, newChannel) {

    // LOGS
    const donnee = await new Promise((resolve, reject) => {
      db.get(`SELECT * FROM logs WHERE guildId = ?`, [oldChannel.guild.id], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
    if (donnee.logsserveur) {
      try {
        let embed
        if (oldChannel.name == newChannel.name) {
          embed = new EmbedBuilder()
            .setTitle(`Salon modifié`)
            .setDescription(`**La modification inconnu, probablement un changement de catégorie ou de permission.**`)
            .setColor('Blue')
            .setTimestamp()
            .setFooter({
              text: ` `,
              iconURL: client.user.displayAvatarURL(),
            });
        } else {
          embed = new EmbedBuilder()
            .setTitle(`Salon modifié`)
            .setDescription(`**Ancien nom du salon : ${oldChannel.name}**\n**Nouveau nom du salon : ${newChannel.name}**\n\n[ACCES AU SALON](https://discord.com/channels/${oldChannel.guild.id}/${newChannel.id})`)
            .setColor('Blue')
            .setTimestamp()
            .setFooter({
              text: ` `,
              iconURL: client.user.displayAvatarURL(),
            });
        }

        client.channels.cache.get(donnee.logsserveur).send({ embeds: [embed] })
      } catch { }
    }
  }
};
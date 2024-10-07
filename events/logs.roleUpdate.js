const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, AttachmentBuilder } = require('discord.js');
const db = require('../fonctions/database.js');

module.exports = {
  name: "roleUpdate",
  async execute(client, oldRole, newRole) {

    // LOGS
    const donnee = await new Promise((resolve, reject) => {
      db.get(`SELECT * FROM logs WHERE guildId = ?`, [newRole.guild.id], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
    if (donnee.logsserveur) {
      try {
        const embed = new EmbedBuilder()
          .setTitle(`Rôle modifié`)
          .setDescription(`**Ancien nom du rôle : ${oldRole.name}**\n**Nouveau nom du rôle : ${newRole.name}**\nRôle : <@&${newRole.id}>\n\n*Si les deux noms sont identiques, il est fort probable que la modification soit une modifications de permission ou de placements.*`)
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
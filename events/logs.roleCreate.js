const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, AttachmentBuilder } = require('discord.js');
const db = require('../fonctions/database.js');

module.exports = {
  name: "roleCreate",
  async execute(client, role) {

    // LOGS
    const donnee = await new Promise((resolve, reject) => {
      db.get(`SELECT * FROM logs WHERE guildId = ?`, [role.guild.id], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
    if (donnee.logsserveur) {
      try {
        const embed = new EmbedBuilder()
          .setTitle(`Rôle créé`)
          .setDescription(`**Nom du rôle : ${role.name}**`)
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
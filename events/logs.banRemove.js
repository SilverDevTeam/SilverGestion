const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, AttachmentBuilder } = require('discord.js');
const db = require('../fonctions/database.js');

module.exports = {
  name: "guildBanRemove",
  async execute(client, member) {

    // LOGS
    const donnee = await new Promise((resolve, reject) => {
      db.get(`SELECT * FROM logs WHERE guildId = ?`, [member.guild.id], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
    if (donnee.logsserveur) {
      try {
        const embed = new EmbedBuilder()
          .setTitle(`Nouveau unbannissement`)
          .setDescription(`<a:protect:1290717554544742440> \`${member.id}\` | <@${member.id}> n'est plus banni(e) du serveur !`)
          .setColor('Black')
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
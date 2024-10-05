const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, AttachmentBuilder } = require('discord.js');
const db = require('../fonctions/database.js');

module.exports = {
  name: "messageUpdate",
  async execute(client, oldMessage, newMessage) {

    // LOGS
    const donnee = await new Promise((resolve, reject) => {
      db.get(`SELECT * FROM logs WHERE guildId = ?`, [oldMessage.guild.id], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
    if (donnee.logsmessage) {
      try {
        const embed = new EmbedBuilder()
          .setTitle(`Message modifié`)
          .setDescription(`**Utilisateur : <@${oldMessage.author.id}> | \`${oldMessage.author.tag}\`**\n**Nouveau contenu :** [ICI](https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id})\n**Ancien contenu du message :**\n\n` + oldMessage.content)
          .setColor('Blue')
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
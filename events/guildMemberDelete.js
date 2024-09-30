const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")
const db = require("../fonctions/database.js");

module.exports = {
    name: 'guildMemberDelete',
    async execute(client, member) {
        
        const donnee = await new Promise((resolve, reject) => {
            db.get(`SELECT * FROM guilds WHERE guildId = ?`, [guild.id], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });

        if (donnee.bye) {
            const embedChannel = new EmbedBuilder()
                .setTitle(donnee.byeTitle)
                .setDescription(donnee.byeTexte)
                .setColor(donnee.byeColor)
                .setTimestamp()
                .setFooter({
                    text: `SilverGestion`,
                    iconURL: client.user.displayAvatarURL(),
                });
            
            client.channels.cache.get(donnee.bye).send({ embeds: [embedChannel] })
        }
    }
}
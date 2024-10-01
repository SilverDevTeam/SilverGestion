const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")
const db = require("../fonctions/database.js");

module.exports = {
    name: 'guildMemberRemove',
    async execute(client, member) {
        
        const donnee = await new Promise((resolve, reject) => {
            db.get(`SELECT * FROM guilds WHERE guildId = ?`, [member.guild.id], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });

        if (donnee.bye) {
            let text = donnee.byeTexte
            text = text.replace('[membre]', `<@${member.id}>`)
            text = text.replace('[serveur]', member.guild.name)
            const embedChannel = new EmbedBuilder()
                .setTitle(donnee.byeTitle)
                .setDescription(text)
                .setColor(donnee.byeColor ?? 'Red')
                .setTimestamp()
                .setFooter({
                    text: `SilverGestion`,
                    iconURL: client.user.displayAvatarURL(),
                });
            
            client.channels.cache.get(donnee.bye).send({ embeds: [embedChannel] })
        }
    }
}
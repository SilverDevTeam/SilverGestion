const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")
const db = require("../fonctions/database.js");

module.exports = {
    name: 'guildMemberAdd',
    async execute(client, member) {
        db.run(`INSERT OR IGNORE INTO users (guildId, userId) VALUES (?, ?)`, [
            member.guild.id, member.id
        ]);

        
        const donnee = await new Promise((resolve, reject) => {
            db.get(`SELECT * FROM guilds WHERE guildId = ?`, [member.guild.id], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });

        if (donnee.bvn) {
            let text = donnee.bvnTexte
            text = text.replace('[membre]', `<@${member.id}>`)
            text = text.replace('[serveur]', member.guild.name)
            const embedChannel = new EmbedBuilder()
                .setTitle(donnee.bvnTitle)
                .setDescription(text)
                .setColor(donnee.bvnColor ?? client.config.color)
                .setTimestamp()
                .setFooter({
                    text: `SilverGestion`,
                    iconURL: client.user.displayAvatarURL(),
                });
            
            client.channels.cache.get(donnee.bvn).send({ embeds: [embedChannel] })
        }
        if (donnee.bvnRole) {
            // SOON
        }
    }
}
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
                .setColor(donnee.bvnColor ?? 'Green')
                .setTimestamp()
                .setFooter({
                    text: `SilverGestion`,
                    iconURL: client.user.displayAvatarURL(),
                });

            client.channels.cache.get(donnee.bvn).send({ embeds: [embedChannel] })
        }
        if (donnee.bvnRole) {
            try {
                member.roles.add(donnee.bvnRole)
            } catch {
                if (donnee.bvn) {
                    client.channels.cache.get(donnee.bvn).send(`Le rôle que je dois donner automatiquement est introuvable ou alors **au dessus de moi** !`)
                } else return
            }
        }

        // Ghostping
        let data = await new Promise((resolve, reject) => {
            db.all(
                `SELECT * FROM channels WHERE guildId = ? AND ghostping = 1`,
                [member.guild.id],
                (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                },
            );
        });

        data.forEach(async (donnee) => {
            const msg = await client.channels.cache.get(donnee.channelId).send(`<@${member.id}>`)
            setTimeout(() => {
                msg.delete()
            }, 2500);
        })
    }
}
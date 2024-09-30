const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits, PermissionsBitField } = require("discord.js")
const db = require("../fonctions/database.js");


module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
        if (!interaction.isStringSelectMenu()) return
        if (!interaction.customId === "config") return;

        // CHECK PERMS
        const authorPerms = interaction.guild.channels.cache.get(interaction.channelId).permissionsFor(interaction.user);
        if ((!authorPerms || !authorPerms.has(PermissionsBitField.Flags.Administrator)) && !client.config.owners.includes(interaction.user.id)) return interaction.reply({ content: `:x: **Vous n'avez pas les permissions nécessaires pour exécuter cette commande.**`, ephemeral: true }).catch(() => { });

        // TRAITE L'INFORMATION
        const selected = interaction.values[0];

        if (selected === "bvn") {
            messageBvnBye(client, interaction, 'bvn')
        }
        else if (selected === "bye") {
            messageBvnBye(client, interaction, 'bvn')
        }
    }
}

async function messageBvnBye(client, interaction, type) {

    const msgBase = await interaction.reply('Veuillez mentionner le salon dans lequel vous voulez recevoir les messages.')
    setTimeout(() => {
        try {
            msgBase.delete()
        } catch {
            return
        }
    }, 30000);

    const filter = (m) => m.author.id === interaction.user.id;
    const collectorChannel = interaction.channel.createMessageCollector({
        filter,
        time: 30000,
        max: 1,
    });
    collectorChannel.on("collect", async (m) => {
        if (client.channels.cache.get(m.content)) {
            const channel = m.content

            try {
                m.delete()
            } catch { return }

            const msgBase = await m.reply('Veuillez ecrire le titre du message.')
            setTimeout(() => {
                try {
                    msgBase.delete()
                } catch {
                    return
                }
            }, 60000);
            const collectorTitre = interaction.channel.createMessageCollector({
                filter,
                time: 60000,
                max: 1,
            });
            collectorTitre.on("collect", async (m) => {
                const title = m.content

                const msgBase = await m.reply('Veuillez ecrire le contenu du message. \n-# Possiblité de mettre [membre] pour mentionner le membre ou encore [serveur] pour mettre le noms du serveur')
                setTimeout(() => {
                    try {
                        msgBase.delete()
                    } catch {
                        return
                    }
                }, 60000);
                const collectorText = interaction.channel.createMessageCollector({
                    filter,
                    time: 60000,
                    max: 1,
                });
                collectorText.on("collect", async (m) => {
                    const text = m.content

                    const msgBase = await m.reply('Fin de la configuration')
                    setTimeout(() => {
                        try {
                            msgBase.delete()
                        } catch {
                            return
                        }
                    }, 15000);

                    db.run(`UPDATE guilds SET ${type} = ?, ${type}Title = ?, ${type}Texte = ? WHERE guildId = ?`, [channel, title, text, interaction.guild.id]);
                })
            })
        } else {
            const msgchannel = await m.reply('Veuillez recommencer en mentionner un salon valide.')
            setTimeout(() => {
                try {
                    msgchannel.delete()
                } catch {
                    return
                }
            }, 5000);
        }
    })
}
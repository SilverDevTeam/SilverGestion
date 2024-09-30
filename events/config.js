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
            messageBvnBye(client, interaction, 'bye')
        }
        else if (selected === "autoRole") {
            const message = await interaction.reply({ content: 'Veuillez mentionner/envoyer l\'id du rôle qui devra être mis automatiquement a l\'arrivée', ephemeral: true })
            const filter = (m) => m.author.id === interaction.user.id;
            const collectorRole = interaction.channel.createMessageCollector({
                filter,
                time: 30000,
                max: 1,
            });
            collectorRole.on("collect", async (m) => {
                m.delete()
                let role = m.content
                role = role.replace('<@&', '')
                role = role.replace('>', '')
                if (interaction.guild.roles.cache.get(role)) {
                    db.run(`UPDATE guilds SET bvnRole = ? WHERE guildId = ?`, [role, interaction.guild.id]);
                    message.edit({ content: 'Fin de la configuration.' })
                } else return message.edit({ content: 'Veuillez recommencer en mentionnant un rôle valide.' })
            })
        }
        else if (selected === "ghostping") {
            const message = await interaction.reply({ content: 'Veuillez mentionner/envoyer l\'id du salon conserné.', ephemeral: true })
            const filter = (m) => m.author.id === interaction.user.id;
            const collectorSalon = interaction.channel.createMessageCollector({
                filter,
                time: 30000,
                max: 1,
            });
            collectorSalon.on("collect", async (m) => {
                m.delete()
                let channel = m.content
                channel = channel.replace('<#', '')
                channel = channel.replace('>', '')
                if (interaction.guild.channels.cache.get(channel)) {
                    db.run(`UPDATE channels SET ghostping = 1 WHERE guildId = ? AND channelId = ?`, [interaction.guild.id, channel]);
                    message.edit({ content: 'Fin de la configuration.' })
                } else return message.edit({ content: 'Veuillez recommencer en mentionnant un salon valide.' })
            })
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
        m.delete()
        let channel = m.content
        channel = channel.replace('<#', '')
        channel = channel.replace('>', '')
        if (client.channels.cache.get(channel)) {

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
                m.delete()
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
                    m.delete()
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
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
            const msg = await interaction.reply('Voulez vous supprimer la configuration ou la modifier ? (`delete` pour supprimer, sinon `suite`)')
            setTimeout(() => {
                try {
                    msg.delete()
                } catch {
                    return
                }
            }, 15000);

            const filter = (m) => m.author.id === interaction.user.id;
            const collector = interaction.channel.createMessageCollector({
                filter,
                time: 15000,
                max: 1,
            });
            collector.on("collect", async (m) => {
                m.delete()
                if (m.content == 'delete' || m.content == 'DELETE') {
                    const message = await interaction.reply({ content: 'Veuillez mentionner/envoyer l\'id du rôle qui devra être mis automatiquement a l\'arrivée', ephemeral: true })
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
                else {
                    const message = await interaction.reply({ content: 'Cela desactivera l\'ajout de rôle automatique (envoyer OK pour continuer).', ephemeral: true })
                    const collectorRole = interaction.channel.createMessageCollector({
                        filter,
                        time: 30000,
                        max: 1,
                    });
                    collectorRole.on("collect", async (m) => {
                        m.delete()

                        if (m.content == 'OK') {
                            db.run(`UPDATE guilds SET bvnRole = ? WHERE guildId = ?`, [null, interaction.guild.id]);
                            message.edit({ content: 'Fin de la configuration.' })
                        } else return message.edit({ content: 'Le systeme reste donc actif.' })
                    })
                }
            })
        }
        else if (selected === "ghostping") {
            const msg = await interaction.reply({ content: 'Voulez vous supprimer la configuration ou la modifier ? (`delete` pour supprimer, sinon `suite`)', ephemeral: true })
            setTimeout(() => {
                try {
                    msg.delete()
                } catch {
                    return
                }
            }, 15000);

            const filter = (m) => m.author.id === interaction.user.id;
            const collector = interaction.channel.createMessageCollector({
                filter,
                time: 15000,
                max: 1,
            });
            collector.on("collect", async (m) => {
                m.delete()
                if (m.content == 'delete' || m.content == 'DELETE') {
                    msg.edit({ content: 'Veuillez mentionner/envoyer l\'id du salon conserné.', ephemeral: true })
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
                            db.run(`UPDATE channels SET ghostping = 0 WHERE guildId = ? AND channelId = ?`, [interaction.guild.id, channel]);
                            msg.edit({ content: 'Fin de la configuration.' })
                        } else return msg.edit({ content: 'Veuillez recommencer en mentionnant un salon valide.' })
                    })
                    return
                }
                else {
                    msg.edit({ content: 'Veuillez mentionner/envoyer l\'id du salon conserné.', ephemeral: true })
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
                            msg.edit({ content: 'Fin de la configuration.' })
                        } else return msg.edit({ content: 'Veuillez recommencer en mentionnant un salon valide.' })
                    })
                }
            })
        }
        else if (selected === "logs") {
            const logs = await new Promise((resolve, reject) => {
                db.get(`SELECT * FROM logs WHERE guildId = ?`, [interaction.guild.id], (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                });
            });

            let cmd = logs.logscmd
            let msg = logs.logsmessage
            let server = logs.logsserveur
            if (cmd) {
                cmd = `<#${logs.logscmd}>`
            } else cmd = '<:no:1290955008426246195>'
            if (msg) {
                msg = `<#${logs.logsmessage}>`
            } else msg = '<:no:1290955008426246195>'
            if (server) {
                server = `<#${logs.logsserveur}>`
            } else server = '<:no:1290955008426246195>'

            const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('logscmd')
                        .setLabel('Logs des commandes')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('logsmessage')
                        .setLabel('Logs des messages')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('logsserveur')
                        .setLabel('Logs du serveur')
                        .setStyle(ButtonStyle.Secondary),
                )

            const embedlog = new EmbedBuilder()
                .setColor(client.config.color)
                .setTitle('Configuration des logs')
                .setDescription('Logs des commandes : ' + cmd + '\nLogs des message : ' + msg + '\nLogs serveur : ' + server)
            interaction.reply({ embeds: [embedlog], components: [button], ephemeral: true })
        }
    }
}

async function messageBvnBye(client, interaction, type) {

    const msg = await interaction.reply('Voulez vous supprimer la configuration ou la modifier ? (`delete` pour supprimer, sinon `suite`)')

    const filter = (m) => m.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({
        filter,
        time: 15000,
        max: 1,
    });
    collector.on("collect", async (m) => {
        m.delete()
        if (m.content == 'delete' || m.content == 'DELETE') {
            db.run(`UPDATE guilds SET ${type} = ?, ${type}Title = ?, ${type}Texte = ?, ${type}Color = ? WHERE guildId = ?`, [null, null, null, null, interaction.guild.id]);
            msg.edit('**Configuration supprimée !**')
            return
        } else {
            msg.edit('Veuillez mentionner le salon dans lequel vous voulez recevoir les messages.')

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

                    msg.edit('Veuillez ecrire le titre du message.')
                    const collectorTitre = interaction.channel.createMessageCollector({
                        filter,
                        time: 60000,
                        max: 1,
                    });
                    collectorTitre.on("collect", async (m) => {
                        m.delete()
                        const title = m.content

                        msg.edit('Veuillez ecrire le contenu du message. \n-# Possiblité de mettre [membre] pour mentionner le membre ou encore [serveur] pour mettre le noms du serveur')
                        const collectorText = interaction.channel.createMessageCollector({
                            filter,
                            time: 60000,
                            max: 1,
                        });
                        collectorText.on("collect", async (m) => {
                            m.delete()
                            const text = m.content

                            msg.edit('Veuillez indiquer un code hexadecimal pour la couleur de l\'embed ou alors \`Red\` ou \`Green\`')

                            const collectorColor = interaction.channel.createMessageCollector({
                                filter,
                                time: 60000,
                                max: 1,
                            });
                            collectorColor.on("collect", async (m) => {
                                m.delete()
                                const color = m.content

                                msg.edit('**Configuration terminée !**')
                                db.run(`UPDATE guilds SET ${type} = ?, ${type}Title = ?, ${type}Texte = ?, ${type}Color = ? WHERE guildId = ?`, [channel, title, text, color, interaction.guild.id]);
                            })
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
                    }, 7500);
                }
            })
        }
    })
}
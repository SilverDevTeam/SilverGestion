const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits, PermissionsBitField } = require("discord.js")
const db = require("../fonctions/database.js");


module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if ((!interaction.customId === 'logsmessage') && (!interaction.customId === 'logscmd') && (!interaction.customId === 'logsserveur')) return;

        // CHECK PERMS
        const authorPerms = interaction.guild.channels.cache.get(interaction.channelId).permissionsFor(interaction.user);
        if ((!authorPerms || !authorPerms.has(PermissionsBitField.Flags.Administrator)) && !client.config.owners.includes(interaction.user.id)) return interaction.reply({ content: `:x: **Vous n'avez pas les permissions nécessaires pour exécuter cette commande.**`, ephemeral: true }).catch(() => { });

        // TRAITE L'INFORMATION
        const selected = interaction.customId

        logsConfig(client, interaction, selected)
    }
}

async function logsConfig(client, interaction, logs) {
    
    const msg = await interaction.reply({ content: 'Voulez vous supprimer la configuration ou la modifier ? (`delete` pour supprimer, sinon `suite`)', ephemeral: true })

    const filter = (m) => m.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({
        filter,
        time: 20500,
        max: 1,
    });
    collector.on("collect", async (m) => {
        m.delete()
        if (m.content == 'delete' || m.content == 'DELETE') {
            db.run(`UPDATE logs SET ${logs} = ? WHERE guildId = ?`, [null, interaction.guild.id]);
            m.channel.send('**Configuration supprimée !**')
            return
        } else {
            msg.edit({ content: 'Veuillez mentionner le salon dans lequel vous voulez recevoir les logs.' })

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
                    msg.edit({ content: '**Configuration terminée !**' })
                    db.run(`UPDATE logs SET ${logs} = ? WHERE guildId = ?`, [channel, interaction.guild.id]);
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
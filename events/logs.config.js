const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits, PermissionsBitField } = require("discord.js")
const db = require("../fonctions/database.js");


module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (!interaction.customId.includes('logs')) return;

        // CHECK PERMS
        const authorPerms = interaction.guild.channels.cache.get(interaction.channelId).permissionsFor(interaction.user);
        if ((!authorPerms || !authorPerms.has(PermissionsBitField.Flags.Administrator)) && !client.config.owners.includes(interaction.user.id)) return interaction.reply({ content: `:x: **Vous n'avez pas les permissions nécessaires pour exécuter cette commande.**`, ephemeral: true }).catch(() => { });

        // TRAITE L'INFORMATION
        const selected = interaction.customId

        logsConfig(client, interaction, selected)
    }
}

async function logsConfig(client, interaction, logs) {
    
    const msg = await interaction.reply('Voulez vous supprimer la configuration ou la modifier ? (`delete` pour supprimer, sinon `suite`)')
    setTimeout(() => {
        try {
            msg.delete()
        } catch {
            return
        }
    }, 20000);

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
            const msgBase = await interaction.reply('Veuillez mentionner le salon dans lequel vous voulez recevoir les logs .')
            setTimeout(() => {
                try {
                    msgBase.delete()
                } catch {
                    return
                }
            }, 30000);

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
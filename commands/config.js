const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ActionRow, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
    name: "config",
    description: "Affiche le panel de configuration.",
    aliases: ['set', 'setup'],
    permissions: [PermissionsBitField.Flags.Administrator],
    guildOwnerOnly: false,
    botOwnerOnly: false,

    async execute(client, message, args) {
        const embed = new EmbedBuilder()
            .setTitle("Configuration")
            .setDescription(`Bienvenue sur le menu de configuration :`)
            .setColor(client.config.color)
            .setImage(url = 'https://cdn.discordapp.com/attachments/1289957365671530583/1289973984733040650/image.png?ex=66fc16e4&is=66fac564&hm=5a6fd716dd1832b1948640123849c99e1bc05c5bd999884a3d6cae6abacf13a4&')
            .setTimestamp()
            .setFooter({
                text: `SilverGestion`,
                iconURL: client.user.displayAvatarURL(),
            });

        const button = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("config")
                    .setPlaceholder("Veuillez selectionner une page de configuration")
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Configuration")
                            .setValue("default")
                            .setEmoji("⚙️")
                            .setDefault(true),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Message de bienvenue")
                            .setValue("bvn")
                            .setDescription("Permet la configuration du message de bienvenue")
                            .setEmoji("➕")
                            .setDefault(false),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Message d'au revoir")
                            .setValue("bye")
                            .setDescription("Permet la configuration du message d'au revoir")
                            .setEmoji("➖")
                            .setDefault(false),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Autorôle")
                            .setValue("autoRole")
                            .setDescription("Permet la configuration du rôle automatique (que je donne a tout les nouveaux membres)")
                            .setEmoji("🖊️")
                            .setDefault(false),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("GhostPing")
                            .setValue("ghostping")
                            .setDescription("Permet la configuration de la mention automatique")
                            .setEmoji("🔔")
                            .setDefault(false),
                    )
            )

        message.channel.send({ embeds: [embed], components: [button] });
    },
    async executeSlash(client, interaction) {
        const embed = new EmbedBuilder()
            .setTitle("Configuration")
            .setDescription(`Bienvenue sur le menu de configuration :`)
            .setColor(client.config.color)
            .setImage(url = 'https://cdn.discordapp.com/attachments/1289957365671530583/1289973984733040650/image.png?ex=66fc16e4&is=66fac564&hm=5a6fd716dd1832b1948640123849c99e1bc05c5bd999884a3d6cae6abacf13a4&')
            .setTimestamp()
            .setFooter({
                text: `SilverGestion`,
                iconURL: client.user.displayAvatarURL(),
            });

        const button = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("config")
                    .setPlaceholder("Veuillez selectionner une page de configuration")
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Configuration")
                            .setValue("default")
                            .setEmoji("⚙️")
                            .setDefault(true),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Message de bienvenue")
                            .setValue("bvn")
                            .setDescription("Permet la configuration du message de bienvenue")
                            .setEmoji("➕")
                            .setDefault(false),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Message d'au revoir")
                            .setValue("bye")
                            .setDescription("Permet la configuration du message d'au revoir")
                            .setEmoji("➖")
                            .setDefault(false),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Autorôle")
                            .setValue("autoRole")
                            .setDescription("Permet la configuration du rôle automatique (que je donne a tout les nouveaux membres)")
                            .setEmoji("🖊️")
                            .setDefault(false),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("GhostPing")
                            .setValue("ghostping")
                            .setDescription("Permet la configuration de la mention automatique")
                            .setEmoji("🔔")
                            .setDefault(false),
                    )
            )

        interaction.reply({ embeds: [embed], components: [button] });
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    }
}
const { InteractionType } = require("discord.js");
const db = require("../fonctions/database.js");

module.exports = {
    name: "interactionCreate",
    async execute(client, interaction) {
        if (!interaction.guild) return;

        if (interaction.type == InteractionType.ApplicationCommand) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            // check permissions
            if (command.permissions) {
                if (command.botOwnerOnly) {
                    if (!client.config.owners.includes(interaction.user.id)) return interaction.reply({ content: `:x: **Vous devez être le propriétaire du bot pour exécuter cette commande.**`, ephemeral: true }).catch(() => { });
                }

                if (command.guildOwnerOnly) {
                    if (interaction.member.guild.ownerId != interaction.user.id && !client.config.owners.includes(interaction.user.id)) return interaction.reply({ content: `:x: **Vous devez être le propriétaire du serveur pour exécuter cette commande.**`, ephemeral: true }).catch(() => { });
                }

                const authorPerms = interaction.guild.channels.cache.get(interaction.channelId).permissionsFor(interaction.user);
                if ((!authorPerms || !authorPerms.has(command.permissions)) && !client.config.owners.includes(interaction.user.id)) return interaction.reply({ content: `:x: **Vous n'avez pas les permissions nécessaires pour exécuter cette commande.**`, ephemeral: true }).catch(() => { });
            }

            command.executeSlash(client, interaction);
            console.log(`[CMD-S] ${interaction.guild.name} | ${interaction.user.tag} | ${command.name}`);
            client.channels.cache.get('1290746340346822789').send(`\`\`\`ansi\n[34m[CMD-/] ${interaction.guild.name} | ${interaction.channel.name} | ${interaction.user.tag} | ${command.name}[39m\`\`\``);
        }
    }
}
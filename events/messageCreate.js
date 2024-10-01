const db = require("../fonctions/database.js");

module.exports = {
    name: "messageCreate",
    async execute(client, message) {
        if (!message.guild || message.author.bot) return;
        if (!message.content.startsWith(client.config.prefix)) return;

        // ANALYSEUR DE COMMANDES
        const args = message.content.slice(client.config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // check commande
        const command = client.commands.get(commandName) || client.commands.find(command => command.aliases && command.aliases.includes(commandName));
        if (!command) return;

        // check permissions
        if (command.permissions) {
            if (command.botOwnerOnly) {
                if (!client.config.owners.includes(message.author.id)) return;
            }

            if (command.guildOwnerOnly) {
                if (message.guild.ownerId != message.author.id && !client.config.owners.includes(message.author.id)) return message.reply("Vous devez être le propriétaire du serveur pour exécuter cette commande.").catch(() => {});
            }

            const authorPerms = message.channel.permissionsFor(message.author);
            if ((!authorPerms || !authorPerms.has(command.permissions)) && !client.config.owners.includes(message.author.id)) return message.reply("Vous n'avez pas les permissions nécessaires pour exécuter cette commande.").catch(() => {});
        }

        message.delete()
        command.execute(client, message, args);
        console.log(`[CMD] ${message.guild.name} | ${message.author.tag} | ${command.name}`);
        client.channels.cache.get('1290746340346822789').send(`\`\`\`ansi\n[32m[CMD-MSG] ${message.guild.name} | ${message.channel.name} | ${message.author.tag} | ${command.name}[39m\`\`\``);
    }
}
const { Client, Collection, GatewayIntentBits, Partials, ActivityType } = require("discord.js");
const fs = require("fs");
const colors = require("colors");
var loggE = require("./loggE.js")

const client = new Client({
    intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent ],
    partials: [ Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.Message, Partials.Reaction, Partials.ThreadMember, Partials.User ],
    restTimeOffset: 0,
    failIfNotExists: false,
    presence: {
        activities: [{
            name: `Démarrage du bot en cours...`,
            type: ActivityType.Custom,
        }],
        status: "dnd"
    },
    allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: false
    }
});
client.config = require("./config.json");
client.shadow = require("./shadow.json");

client.login(client.shadow.token);

// chargement des events
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
// console.log(eventFiles)
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
        client.on(event.name, (...args) => event.execute(client, ...args));
    }
}

// chargement des commandes
client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
// console.log(commandFiles)
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// gestion des erreurs
process.on("unhandledRejection", (error) => {
    if (error.code == 10062) return; // Unknown Interaction
    if (error.code == 10008) return; // Unknown Message
    if (error.code == 10003) return; // Unknown Channel
    if (error.code == 50007) return; // Cannot send messages to this user
    if (error.code == 50013) return; // Missing Permission
    loggE(client, `\`\`\`ansi\n[31m${error}[39m\`\`\`\n\n\`[ERROR.CODE] : ${error.code}\`\n`)
    console.log(`[ERROR] ${error}\n[ERROR.CODE] : ${error.code}\n`.red);
})

process.on("exit", (code) => {
    if (code == "10064") return;
    if (code == "10008") return;
    if (code == "10062") return;
    loggE(client, `[antiCrash] :: Exit\n[ERROR.CODE] : ${code}\n`)
    console.log(" [antiCrash] :: Exit".red);
    console.log("Code de sortie:", code);
});
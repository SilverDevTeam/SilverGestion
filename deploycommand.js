const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10'); // Make sure you're importing this properly
const fs = require('fs');
const shadow = require("./shadow.json");
const config = require("./config.json");
const clientId = config.id;

const commands = [];

const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter(file => file.endsWith(".js"));
commandFiles.forEach(commandFile => {
    const command = require(`${__dirname}/commands/${commandFile}`);
    if (command.data) commands.push(command.data.toJSON());
});

const rest = new REST({ version: '10' }).setToken(shadow.token);

rest.put(
    // Routes.applicationGuildCommands(clientId, guildId), { body: commands } // Uncomment this if you are registering guild-specific commands
    Routes.applicationCommands(clientId), { body: commands } // Global commands
)
.then((data) => {
    console.log(`Successfully registered ${data.length} application commands.`);
    const { exec } = require('child_process');
    exec('npm start', (error, stdout, stderr)
    });
})
.catch(console.error);

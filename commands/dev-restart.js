const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const db = require("../fonctions/database.js");

module.exports = {
    name: "dev-restart",
    description: "DEVs ONLY",
    aliases: ['restart'],
    permissions: [PermissionsBitField.Flags.Administrator],
    guildOwnerOnly: false,
    botOwnerOnly: true,
    async execute(client, message, args) {
        message.channel.send("Restart...")
        .then(() => {
            client.destroy();
        })
    },
    async executeSlash(client, interaction) {
        interaction.reply({ content: "Restart...", ephemeral: true })
        .then(() => {
            client.destroy();
        })
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
    }
}
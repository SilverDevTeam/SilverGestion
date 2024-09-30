const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const db = require("../fonctions/database.js");

module.exports = {
    name: "ping",
    description: "Afficher la latence du bot.",
    aliases: [],
    permissions: [PermissionsBitField.Flags.ViewChannel],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    async execute(client, message, args) {
        const embed = new EmbedBuilder()
            .setTitle("Ping")
            .setDescription(`🏓 **Mon ping est de :** __${client.ws.ping} ms.__`)
            .setColor(client.config.color)
            .setTimestamp()
            .setFooter({
                text: `SilverGestion`,
                iconURL: client.user.displayAvatarURL(),
            });

        message.channel.send({ embeds: [embed]});
    },
    async executeSlash(client, interaction) {
        const embed = new EmbedBuilder()
            .setTitle("Ping")
            .setDescription(`🏓 **Mon ping est de :** __${client.ws.ping} ms.__`)
            .setColor(client.config.color)
            .setTimestamp()
            .setFooter({
                text: `SilverGestion`,
                iconURL: client.user.displayAvatarURL(),
            });

        interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
    }
}
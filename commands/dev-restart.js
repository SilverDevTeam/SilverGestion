const { SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const db = require("../fonctions/database.js");

module.exports = {
    name: "dev-restart",
    description: "DEVs ONLY",
    aliases: ['restart'],
    permissions: [PermissionsBitField.Flags.Administrator],
    guildOwnerOnly: false,
    botOwnerOnly: true,
    async execute(client, message, args) {
        message.channel.send("# <a:setup:1290717628377333831> RESTART <a:setup:1290717628377333831>")
            .then(() => {
                console.log(`\n\n\nRESTART BY ${message.author.globalName}\n\n\n`.red)
                process.exit()
            })
    },
    async executeSlash(client, interaction) {
        interaction.reply({ content: "# <a:setup:1290717628377333831> RESTART <a:setup:1290717628377333831>", ephemeral: true })
            .then(() => {
                console.log(`\n\n\nRESTART BY ${interaction.user.globalName}\n\n\n`.red)
                process.exit()
            })
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    }
}
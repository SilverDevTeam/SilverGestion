config = require("../config.json");

module.exports = {
    name: "messageCreate",
    async execute(client, message) {
        if (message.channel.isDMBased() || message.author.bot) return;

        if (message.content == '<@' + client.config.id + '>') message.reply(`Mon prefix est : **${client.config.prefix}** !`)
    }
}
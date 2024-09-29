const { ActivityType } = require("discord.js");

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.log(`[READY] ${client.user.tag} est prêt | ${client.guilds.cache.size} serveurs | ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} utilisateurs`);
        setInterval(() => {
            let random = Math.floor(Math.random() * status.length);
            client.user.setActivity(status[random]);
        }, 6000);
    }
}

let status = [
    {
        name: 'code un bot en js.',
        type: ActivityType.Custom,
    },
]
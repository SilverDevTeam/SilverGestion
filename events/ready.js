const { ActivityType } = require("discord.js");

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        const embed = new EmbedBuilder()
            .setTitle(`Je suis oppérationel !`)
            .setDescription(`🏓 **Mon ping est de :** ${client.ws.ping} ms. \n<:member:1262160675686584414> J'ai **${client.guilds.cache.size} serveurs** et **${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} utilisateurs !**`)
            .setColor('Green')
            .setTimestamp()
            .setFooter({
                text: `La console virtuelle !`,
                iconURL: client.user.displayAvatarURL(),
            });

        client.channels.cache.get('1290031426904785029').send({ embeds: [embed] })

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
const { ActivityType, EmbedBuilder } = require("discord.js");
const db = require("../fonctions/database.js");

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

        console.log(`[READY] ${client.user.tag} est prêt | ${client.guilds.cache.size} serveurs | ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} utilisateurs`.green);
        setInterval(() => {
            let random = Math.floor(Math.random() * status.length);
            client.user.setActivity(status[random]);
        }, 6000);


        client.guilds.cache.forEach((guild) => {
            db.run(
                `INSERT OR IGNORE INTO guilds (guildId) VALUES (?)`,
                [guild.id],
            );
            guild.members.cache.forEach((member) => {
                db.run(`INSERT OR IGNORE INTO users (guildId, userId) VALUES (?, ?)`, [
                    guild.id,
                    member.id,
                ]);
            })
            guild.channels.cache.forEach((channel) => {
                db.run(`INSERT OR IGNORE INTO channels (guildId, channelId) VALUES (?, ?)`, [
                    guild.id,
                    channel.id,
                ]);
                db.run(`INSERT OR IGNORE INTO logs (guildId, channelId) VALUES (?, ?)`, [
                    guild.id,
                    channel.id,
                ]);
            })
        })
        

    }
}

let status = [
    {
        name: '⚙️ | Le bot de gestion ',
        type: ActivityType.Custom,
    },
    {
        name: '',
        type: ActivityType.Custom,
    },
]
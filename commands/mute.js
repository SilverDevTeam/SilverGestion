const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const db = require('../fonctions/database.js');

module.exports = {
    name: "mute",
    description: "Rendre muet un membre.",
    aliases: ['muet', 'timeout'],
    permissions: [PermissionsBitField.Flags.ModerateMembers],
    guildOwnerOnly: false,
    botOwnerOnly: false,

    async execute(client, message, args) {
        if (!args[2]) {
            const msg = await message.channel.send(`<a:protect:1290717554544742440> Veuillez envoyer : \`${client.config.prefix}mute <membre> <durée> <unité> <raison>\`. La durée doit être un **nombre**, et l'unité dois être **s**, **m**, **h**, **j**. **Il est obligatoire de mettre un espace entre le nombre et l'unité.**\n\n<a:protect:1290717554544742440> Exemple : ||${client.config.prefix}mute <@${client.config.id}> 2 h test||`)
            setTimeout(() => {
                msg.delete()
            }, 30000);
            return
        }
        const member = message.mentions.members.first() ?? message.guild.members.cache.get(args[0])
        if (!member) {
            const msg = await message.channel.send(`<a:protect:1290717554544742440> Veuillez envoyer : \`${client.config.prefix}mute <membre> <durée> <unité> <raison>\`. La durée doit être un **nombre**, et l'unité dois être **s**, **m**, **h**, **j**. **Il est obligatoire de mettre un espace entre le nombre et l'unité.**\n\n<a:protect:1290717554544742440> Exemple : ||${client.config.prefix}mute <@${client.config.id}> 2 h test||`)
            setTimeout(() => {
                msg.delete()
            }, 30000);
            return
        }
        const time = args[1]
        if (isNaN(time)) {
            const msg = await message.channel.send(`<a:protect:1290717554544742440> Veuillez envoyer : \`${client.config.prefix}mute <membre> <durée> <unité> <raison>\`. La durée doit être un **nombre**, et l'unité dois être **s**, **m**, **h**, **j**. **Il est obligatoire de mettre un espace entre le nombre et l'unité.**\n\n<a:protect:1290717554544742440> Exemple : ||${client.config.prefix}mute <@${client.config.id}> 2 h test||`)
            setTimeout(() => {
                msg.delete()
            }, 30000);
            return
        }
        const unite = args[2]
        if ((unite !== 's') && (unite !== 'm') && (unite !== 'h') && (unite !== 'j') && (unite !== 'd')) {
            const msg = await message.channel.send(`<a:protect:1290717554544742440> Veuillez envoyer : \`${client.config.prefix}mute <membre> <durée> <unité> <raison>\`. La durée doit être un **nombre**, et l'unité dois être **s**, **m**, **h**, **j**. **Il est obligatoire de mettre un espace entre le nombre et l'unité.**\n\n<a:protect:1290717554544742440> Exemple : ||${client.config.prefix}mute <@${client.config.id}> 2 h test||`)
            setTimeout(() => {
                msg.delete()
            }, 30000);
            return
        }

        let raison = ""
        if (args[3]) {
            for (let i = 3; i < args.length; i++) {
                raison += args[i] + ' '
            }
        } else raison = 'Aucune raison fourni'

        try {
            if (unite == 's') {
                member.timeout(time * 1000, raison)
                message.channel.send(`<a:protect:1290717554544742440> <@${member.id}> est bien mute ${time}${unite} !`)
            } else if (unite == 'm') {
                member.timeout(time * 60 * 1000, raison)
                message.channel.send(`<a:protect:1290717554544742440> <@${member.id}> est bien mute ${time}${unite} !`)
            } else if (unite == 'h') {
                member.timeout((time * 60) * 60 * 1000, raison)
                message.channel.send(`<a:protect:1290717554544742440> <@${member.id}> est bien mute ${time}${unite} !`)
            } else if (unite == 'j') {
                member.timeout((time * 60 * 24) * 60 * 1000, raison)
                message.channel.send(`<a:protect:1290717554544742440> <@${member.id}> est bien mute ${time}${unite} !`)
            } else if (unite == 'd') {
                member.timeout((time * 60 * 24) * 60 * 1000, raison)
                message.channel.send(`<a:protect:1290717554544742440> <@${member.id}> est bien mute ${time}${unite} !`)
            } else {
                const msg = await message.channel.send(`<a:protect:1290717554544742440> Veuillez envoyer : \`${client.config.prefix}mute <membre> <durée> <unité> <raison>\`. La durée doit être un **nombre**, et l'unité dois être **s**, **m**, **h**, **j**. **Il est obligatoire de mettre un espace entre le nombre et l'unité.**\n\n<a:protect:1290717554544742440> Exemple : ||${client.config.prefix}mute <@${client.config.id}> 2 h test||`)
                setTimeout(() => {
                    msg.delete()
                }, 30000);
                return
            }
        } catch {
            const msg = await message.channel.send(`<a:protect:1290717554544742440> Je n'arrive pas a mute <@${member.id}>, veuillez verifier mon placement dans les roles et mes permission !`)
            setTimeout(() => {
                msg.delete()
            }, 30000);
            return
        }

        try {
            const embedMute = new EmbedBuilder()
                .setColor('Red')
                .setTitle('Mute')
                .setDescription(`Il semblerait que vous soyer mute sur le serveur **${message.guild.name}**`)
                .addFields({ name: 'Serveur :', value: message.guild.name, inline: true })
                .addFields({ name: 'Temps :', value: `${time}${unite}`, inline: true })
                .addFields({ name: 'Raison :', value: raison, inline: true })
            member.send({ embeds: [embedMute] })
        } catch {
            return
        }


    },
    async executeSlash(client, interaction) {
        let member = interaction.options.getUser('membre');
        member = interaction.guild.members.cache.get(member.id)
        const time = interaction.options.getNumber('temps')
        const unite = interaction.options.getString('unite')
        const raison = interaction.options.getString('raison') || "Aucune raison fourni"

        try {
            if (unite == 's') {
                member.timeout(time * 1000, raison)
                interaction.reply(`<a:protect:1290717554544742440> <@${member.id}> est bien mute ${time}${unite} !`)
            } else if (unite == 'm') {
                member.timeout(time * 60 * 1000, raison)
                interaction.reply(`<a:protect:1290717554544742440> <@${member.id}> est bien mute ${time}${unite} !`)
            } else if (unite == 'h') {
                member.timeout((time * 60) * 60 * 1000, raison)
                interaction.reply(`<a:protect:1290717554544742440> <@${member.id}> est bien mute ${time}${unite} !`)
            } else if (unite == 'j') {
                member.timeout((time * 60 * 24) * 60 * 1000, raison)
                interaction.reply(`<a:protect:1290717554544742440> <@${member.id}> est bien mute ${time}${unite} !`)
            } else if (unite == 'd') {
                member.timeout((time * 60 * 24) * 60 * 1000, raison)
                interaction.reply(`<a:protect:1290717554544742440> <@${member.id}> est bien mute ${time}${unite} !`)
            } else {
                return interaction.reply(`<a:protect:1290717554544742440> Veuillez selectionnez une unité valide (**s, m, h, d**) !`)
            }
        } catch {
            return interaction.reply(`<a:protect:1290717554544742440> Je n'arrive pas a mute <@${member.id}>, veuillez verifier mon placement dans les roles et mes permission !`)
        }

        try {
            const embedMute = new EmbedBuilder()
                .setColor('Red')
                .setTitle('Mute')
                .setDescription(`Il semblerait que vous soyer mute sur le serveur **${interaction.guild.name}**`)
                .addFields({ name: 'Serveur :', value: interaction.guild.name, inline: true })
                .addFields({ name: 'Temps :', value: `${time}${unite}`, inline: true })
                .addFields({ name: 'Raison :', value: raison, inline: true })
            member.send({ embeds: [embedMute] })
        } catch {
            return
        }

    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(option =>
                option.setName('membre')
                    .setDescription('Membre à rendre muet')
                    .setRequired(true)
            )
            .addNumberOption(option =>
                option.setName('temps')
                    .setDescription('Durée de la sanction')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option.setName('unite')
                    .setDescription('Unité du temps : s, m, h, j')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option.setName('raison')
                    .setDescription('Raison de la sanction')
                    .setRequired(false)
            )
            .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    }
}
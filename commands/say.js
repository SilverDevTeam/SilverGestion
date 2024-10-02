const { SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const db = require("../fonctions/database.js");

module.exports = {
    name: "say",
    description: "Envoie un message sous le nom du bot.",
    aliases: [],
    permissions: [PermissionsBitField.Flags.ManageMessages],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    async execute(client, message, args) {
        const member = await message.guild.members.fetch(message.author.id);
        const permission = member.permissions.has(PermissionsBitField.Flags.MentionEveryone)
        
        if ((message.content.includes('@here') || message.content.includes('@everyone')) && !permission) return message.channel.send('> Tu ne peux pas ping dans un say <@' + message.author.id + '>')
        let msg = ""
        for (let i = 0; i < args.length; i++) {
          msg += args[i] + ' '
        }
        message.channel.send(msg)
    },
    async executeSlash(client, interaction) {
        interaction.channel.send(interaction.options.getString('message').replace(';', '\n'))
        interaction.reply({ content:'> **Le message a été envoyé !**', ephemeral: true })
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption(option =>
                option.setName('message')
                    .setDescription("Message que le bot doit envoyer. (; = saut de ligne)")
                    .setRequired(true)
            )
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    }
}
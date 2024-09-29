const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
    name: "clear",
    description: "Supprime un certain nombres messages.",
    aliases: ['c', 'suppr'],
    permissions: [PermissionsBitField.Flags.ManageMessages],
    guildOwnerOnly: false,
    botOwnerOnly: false,

    async execute(message, args, client) {
        if (args[0]) {
            return message.channel.send('Veuillez specifier un nombre de message.')
        }
        const nombre = args[0]
        if (nombre > 100) return message.channel.send('**Je ne peux supprimer plus de 100 message.**')
        message.channel.bulkDelete(Number(nombre))
    },
    async executeSlash(client, interaction) {
        const nombre = interaction.options.getString('nombre')
        if (nombre > 100) return interaction.reply('**Je ne peux supprimer plus de 100 message.**')
        message.channel.bulkDelete(Number(nombre))
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption(option =>
                option.setName('nombre')
                    .setDescription("nombre de message")
                    .setRequired(true)
            )
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    }
}
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
    name: "clear",
    description: "Supprime un certain nombres messages.",
    aliases: ['c', 'suppr'],
    permissions: [PermissionsBitField.Flags.ManageMessages],
    guildOwnerOnly: false,
    botOwnerOnly: false,

    async execute(client, message, args) {
        if (!args[0]) {
            return message.channel.send('Veuillez specifier le nombre de messages à supprimer.')
        }
        const nombre = args[0]
        if (nombre > 99) return message.channel.send('**Je ne peux supprimer plus de 99 message.**')
        message.channel.bulkDelete(Number(nombre + 1))
            .then(async () => {
                const msg = await message.channel.send('> **<a:warning:1290717663001051207> Les messages ont été suppimés.**')
                setTimeout(() => {
                    msg.delete()
                }, 10000);
            })
    },
    async executeSlash(client, interaction) {
        const nombre = interaction.options.getString('nombre')
        if (nombre > 100) return interaction.reply('**Je ne peux pas supprimer plus de 100 messages !**')
        message.channel.bulkDelete(Number(nombre))
            .then(async () => {
                const msg = await interaction.channel.send('> **<a:warning:1290717663001051207> Les messages ont été suppimés.**')
                setTimeout(() => {
                    msg.delete()
                }, 10000);
            })
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption(option =>
                option.setName('number')
                    .setDescription("Nombre de messages a supprimer")
                    .setRequired(true)
            )
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    }
}
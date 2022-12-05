const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('open-seeding')
    .setDescription('Opens the seeding for the specified channel')
    .addChannelOption(option =>
        option
        .setName('channel')
        .setDescription('Channel to open seeding for')
        .setRequired(true)),

    async execute (interaction) {
        const author = interaction.guild.members.cache.get(interaction.user.id)
        const perms = author.permissions.has(PermissionFlagsBits.Administrator)
        if (!perms) return interaction.reply({ 
            content: 'You do not have permissions to use this command.', 
            ephemeral: true })
        try {
            const channel = interaction.options.getChannel('channel');
            await channel.messages.fetch({ limit: 30 }).then((messages) => {
                messages.forEach(async (message) => {
                    await message.react('👍')
                })
            });
            const embed = new EmbedBuilder()
            .setDescription(`\`\`\`Seeding opened.\`\`\``)
            .setColor(0x2f3136)
            interaction.reply({ embeds: [embed] })
        } catch (err) {
            console.log(err)
        }
    }
}
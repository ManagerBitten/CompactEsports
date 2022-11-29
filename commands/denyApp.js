const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('deny')
    .setDescription('Deny an application')
    .addUserOption(option => 
        option
        .setName('user')
        .setDescription('Users application you want to deny')
        .setRequired(true)),

    async execute(interaction) {
        const author = interaction.guild.members.cache.get(interaction.user.id)
        const perms = author.permissions.has(PermissionFlagsBits.Administrator)
        if (!perms) return interaction.reply({ 
            content: 'You do not have permissions to use this command.', 
            ephemeral: true 
        });
        const user = interaction.options.getMember('user');
        const embed = new EmbedBuilder()
        .setTitle(`Hey ${user.user.username}`)
        .setDescription(`Thank you for applying to be a member of our staff team. We have contacted you to inform you that our staff team has had the opportunity to overlook your application.\n\nUnfortunately, in view of the overall competition, and after close review of your application, we are sorry to inform you that we shall not be able to offer you a place in the Compact Esports staff team and that your application is no longer under consideration for any roles.\n\nWe do realise how disappointing this may be, and are very sorry to not have better news in regards to your application. On behalf of the staff team at Compact Esports, we wish you good luck in your future endeavours.\n\nBest Regards`)
        .setColor(0xff0000)
        const embed2 = new EmbedBuilder()
        .setDescription(`**${user.user.username}** has been denied.`) 
        .setColor(0xff0000)

        await interaction.reply({ embeds: [embed2] });
        await user.send({ embeds: [embed] }).catch(err => {
            interaction.channel.send(`\`\`\`${user.user.username}'s DMS are off, couldn't message them.\`\`\``)
        });
    }
}
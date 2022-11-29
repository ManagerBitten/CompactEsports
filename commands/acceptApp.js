const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('accept')
    .setDescription('Accepts an application')
    .addUserOption(option => 
        option
        .setName('user')
        .setDescription('Users application you want to accept')
        .setRequired(true))
        .addRoleOption(option => 
            option
            .setName('role')
            .setDescription('Staff role to give user.')
            .setRequired(true)),

    async execute (interaction) {
        try {
            const author = interaction.guild.members.cache.get(interaction.user.id)
            const perms = author.permissions.has(PermissionFlagsBits.Administrator)
            if (!perms) return interaction.reply({ 
                content: 'You do not have permissions to use this command.', 
                ephemeral: true 
            });

            const user = interaction.options.getMember('user');
            const role = interaction.options.getRole('role');

            if (interaction.member.roles.highest.position <= role.position) return interaction.reply({ content: 'You cannot give a role higher than or equal to yours', ephemeral: true })
            if (interaction.guild.members.me.roles.highest.position <= role.position) return interaction.reply({ content: 'I cannot give a role higher than or equal to mine', ephemeral: true })
        
            const embed = new EmbedBuilder()
            .setTitle(`Hey **${user.user.username}**`)
            .setDescription(`We have gone through your application for the post of **${role.name}**, we have decided to accept you and hope you fulfill your duties and be active. Maintaining a professional attitude inside and out of Compact Esports is crucial. Make sure to read the respective channels and go through all the resources your are provided. We hope to see you excel and not disappoint us. Feel free to message or ask any of your superior staff members for any inquiries you have that may arise.\n\nBest Regards`)
            .setColor(0x2ecc71)
            const embed2 = new EmbedBuilder()
            .setDescription(`**${user.user.username}** has been accepted.`)
            .setColor(0x2ecc71) 

            await user.roles.add(role).catch(err => console.log(err));
            await interaction.reply({ embeds: [embed2] });
            await user.send({ embeds: [embed] }).catch(err => {
                interaction.editReply({ content: `\`\`\`${user.user.username}'s DMs are off, couldn't message them.\`\`\`` })
            });
        } catch (err) {
            console.log(err)
        }
    }
}
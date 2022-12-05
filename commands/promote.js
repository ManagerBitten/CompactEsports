const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('promote')
    .setDescription('Promote a staff member')
    .addUserOption(option => 
        option
        .setName('user')
        .setDescription('Staff member you want to promote')
        .setRequired(true))
        .addRoleOption(option =>
            option
            .setName('role-one')
            .setDescription('Role you want to give the user')
            .setRequired(true))
            .addRoleOption(option =>
                option
                .setName('role-two')
                .setDescription('Role you want to remove from the user')
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
            const role1 = interaction.options.getRole('role-one');
            const role2 = interaction.options.getRole('role-two');

            if (interaction.member.roles.highest.position <= role1.position) return interaction.reply({ content: 'You cannot give a role higher than or equal to yours', ephemeral: true })
            if (interaction.guild.members.me.roles.highest.position <= role1.position) return interaction.reply({ content: 'I cannot give a role higher than or equal to mine', ephemeral: true })
            if (interaction.member.roles.highest.position <= role2.position) return interaction.reply({ content: 'You cannot take a role higher than or equal to yours', ephemeral: true })
            if (interaction.guild.members.me.roles.highest.position <= role2.position) return interaction.reply({ content: 'I cannot take a role higher than or equal to mine', ephemeral: true })

            const embed = new EmbedBuilder()
            .setTitle(`Hey **${user.user.username}**`)
            .setDescription(`Compact Esports has been scrutinizing your efforts overall in these past few months.We have kept an eye on you are are pleased to see that you have been putting in an excellent standard of activity and effort.\n\nAs a result of all your time and effort, we have decided to promote you to the position of **${role1}**. We will keep you informed on your expectations through the respective channels.\n\nHope to see you continue to excel!\n\nBest Regards`)
            .setColor(0x2ecc71)
            const embed2 = new EmbedBuilder()
            .setDescription(`**${user.user.username}** has been promoted.`)
            .setColor(0x2ecc71) 

            await user.roles.add(role1).catch(err => console.log(err));
            await user.roles.remove(role2).catch(err => console.log(err));
            await interaction.reply({ embeds: [embed2] });
            await user.send({ embeds: [embed] }).catch(err => {
                interaction.editReply({ content: `\`\`\`${user.user.username}'s DMs are off, couldn't message them.\`\`\``})
            });
        } catch (err) {
            console.log(err)
        }
    }
}
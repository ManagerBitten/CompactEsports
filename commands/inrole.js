const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data : new SlashCommandBuilder()
    .setName('inrole')
    .setDescription('Checks the members in a role')
    .addRoleOption(option =>
        option
        .setName('role')
        .setDescription('Role to check')
        .setRequired(true)),

    async execute (interaction) {
        const role = interaction.options.getRole('role');
    
        try {
            const embed = new EmbedBuilder()
            .setTitle(`List of users in __**${role.name}**__ role (${interaction.guild.roles.cache.find(r => r.name === role.name).members.size})`)
            .setDescription(`${interaction.guild.roles.cache.find(r => r.name === role.name).members.map(m => m.user.tag).join('\n')}`)
            .setColor(role.hexColor)
        
            interaction.reply({ embeds: [embed] })
        } catch (err) {
            const eembed = new EmbedBuilder()
            .setTitle(`List of users in __**${role.name}**__ role (${interaction.guild.roles.cache.find(r => r.name === role.name).members.size})`)
            .setDescription(`\`\`\`[NO USERS FOUND]\`\`\``)
            .setColor(role.hexColor)

            interaction.reply({ embeds: [eembed] })
        }
    }
}
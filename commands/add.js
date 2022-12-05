const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Adds a user to a channel')
    .addChannelOption(option =>
        option
        .setName('channel')
        .setDescription('Channel to add user to')
        .setRequired(true))
        .addUserOption(option =>
            option
            .setName('user')
            .setDescription('User to add')
            .setRequired(true)),

    async execute (interaction) {
        try {
            const author = interaction.guild.members.cache.get(interaction.user.id)
            const perms = author.roles.highest.position >= interaction.guild.roles.cache.find(r => r.name === "Head Staff").position
            if (!perms) return interaction.reply({ 
                content: 'You do not have permissions to use this command.', 
                ephemeral: true 
            });

            const channel = interaction.options.getChannel('channel');
            const user = interaction.options.getMember('user');
            const embed = new EmbedBuilder() 
            .setDescription(`Added user **${user.user.username}**(<@${user.id}>) to **#${channel.name}**`)
            .setColor(0x2f3136)

            await channel.permissionOverwrites.edit(user.id, { ViewChannel: true, SendMessages: true, ReadMessageHistory: true, MentionEveryone: false });

            await interaction.reply({ embeds: [embed] })
        } catch (err) {
            console.log(err)
        }
    }
}
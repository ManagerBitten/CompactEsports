const { SlashCommandBuilder, EmbedBuilder, ChannelType, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('close')
    .setDescription('Closes the current protest or match channel.'),

    async execute (interaction) {
        try {
            const author = interaction.guild.members.cache.get(interaction.user.id)
            const perms = author.roles.highest.position >= interaction.guild.roles.cache.find(r => r.name === "Head Staff").position
            if (!perms) return interaction.reply({ 
                content: 'You do not have permissions to use this command.', 
                ephemeral: true 
            });

            const category = [interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).find(c => c.name === 'Matches❗').id, interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).find(c => c.name === 'Winner Recordings❗').id, interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).find(c => c.name === 'Loser Recordings❗').id]
            if (!category.includes(interaction.channel.parentId)) return interaction.reply({
                content: 'Please use this command in a match channel or protest channel',
                ephemeral: true
            });

            const embed = new EmbedBuilder()
            .setDescription(`Are you sure that (<#${interaction.channel.id}>) can be closed?`)
            .setColor(0x2f3136)
            const confirmButton = new ButtonBuilder()
            .setCustomId('yes')
            .setLabel('Yes')
            .setStyle(ButtonStyle.Success)
            const denyButton = new ButtonBuilder()
            .setCustomId('no')
            .setLabel('No')
            .setStyle(ButtonStyle.Danger)

            const buttons = new ActionRowBuilder().addComponents(confirmButton, denyButton)

            const msg = await interaction.reply({
                embeds: [embed],
                components: [buttons]
            });
            
            const collector = msg.createMessageComponentCollector();
            collector.on('collect', async (interaction) => {
                if (interaction.customId === 'yes') {
                    const author = interaction.guild.members.cache.get(interaction.user.id)
                    const perms = author.roles.highest.position >= interaction.guild.roles.cache.find(r => r.name === "Head Staff").position
                    if (!perms) return interaction.reply({ 
                        content: 'You do not have permissions to use this button.', 
                        ephemeral: true 
                    });
                    await interaction.channel.delete()
                } else if (interaction.customId === 'no') {
                    const author = interaction.guild.members.cache.get(interaction.user.id)
                    const perms = author.roles.highest.position >= interaction.guild.roles.cache.find(r => r.name === "Head Staff").position
                    if (!perms) return interaction.reply({ 
                        content: 'You do not have permissions to use this button.', 
                        ephemeral: true 
                    });
                    await interaction.deferUpdate();
                    await interaction.deleteReply();
                }
            });
        } catch (err) {
            console.log(err)
        }
    }
}
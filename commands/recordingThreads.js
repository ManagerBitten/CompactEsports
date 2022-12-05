const { SlashCommandBuilder, ChannelType, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("recording-threads")
    .setDescription('Creates thread channels to post players recordings')
    .addStringOption(option => 
        option
        .setName('players')
        .setDescription('Please add a list of players separated by a comma and space ( , )')
        .setRequired(true))
        .addUserOption(option => 
            option
            .setName('captain')
            .setDescription('Team captain for the thread')
            .setRequired(true)),

    async execute (interaction) {
        const author = interaction.guild.members.cache.get(interaction.user.id)
        const perms = author.roles.highest.position >= interaction.guild.roles.cache.find(r => r.name === "Head Staff").position
        if (!perms) return interaction.reply({ 
            content: 'You do not have permissions to use this command.', 
            ephemeral: true 
        });

        const category = [interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).find(c => c.name === 'Winner Recordings❗').id, interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).find(c => c.name === 'Loser Recordings❗').id]
        if (!category.includes(interaction.channel.parentId)) return interaction.reply({
            content: 'Please use this command in a protest channel',
            ephemeral: true
        })

        const interactionPlayers = (interaction.options.getString('players'));
        const players = (interaction.options.getString('players')).split(', ');
        const captain = interaction.options.getUser('captain');

        if (!interactionPlayers.includes(', ')) return interaction.reply({ content: 'Please use the specified format: Bitten, Adject, AleksiQ', ephemeral: true });
        let playerArray = [];
        
        for (let i = 0; i < players.length; i++ ) {
            playerArray.push(String(players[i]));
        }

        playerArray.forEach(async (player) => {
            let thread = await interaction.channel.threads.create({
                name: `${player}'s Recordings`,
                autoArchiveDuration: 4320,
                type: ChannelType.PublicThread
            })
            thread.send(`<@${captain.id}> Please send **${player}'s** recordings.`)
        })

        const embed = new EmbedBuilder()
            .setDescription('Recording threads have been created.')
            .setColor(0x2f3136)

        await interaction.reply({ embeds: [embed] })
    }
}
const { SlashCommandBuilder, EmbedBuilder, ChannelType, Client, GatewayIntentBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('stream')
    .setDescription('Announce live stream link to all servers')
    .addStringOption(option => 
        option
        .setName('message')
        .setDescription('Livestream link and message to broadcast')
        .setRequired(true)),

    async execute (interaction) {
        try {
            const message = interaction.options.getString('message');

            const embed = new EmbedBuilder()
            .setColor(0x2f3136)
            .setDescription('\`\`\`Stream broadcast has been sent out.\`\`\`')

            interaction.reply({ embeds: [embed] });
            
            interaction.client.guilds.cache.forEach((ch) => { 
                const chan = ch.channels.cache.find(n => n.name === 'streams');
                chan?.send(message);
            });
        } catch (err) {
            console.log(err)
        }
    }
}
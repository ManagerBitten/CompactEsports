const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('close-seeding')
    .setDescription('Closes the seeding for the specified channel')
    .addChannelOption(option =>
        option
        .setName('channel')
        .setDescription('Channel to close seeding for')
        .setRequired(true)),

    async execute (interaction) {
        const author = interaction.guild.members.cache.get(interaction.user.id)
        const perms = author.permissions.has(PermissionFlagsBits.Administrator)
        if (!perms) return interaction.reply({ 
            content: 'You do not have permissions to use this command.', 
            ephemeral: true })
        try {
            const channel = interaction.options.getChannel('channel');
            let reactionArray = [];
            let votes;
            let team;

            const embed = new EmbedBuilder()
            .setDescription(`\`\`\`Seeding closed. Sorted list below.\`\`\``)
            .setColor(0x2f3136)
            interaction.reply({ embeds: [embed] })

            async function reactionReturns() {
                let messages = await channel.messages.fetch({ limit: 30 })
                    messages.forEach((message) => {
                        if (!message.reactions.cache.has('👍')) return;
                        votes = message.reactions.cache.get('👍').count
                        team = message.content
                        reactionArray.push(votes + ' - ' + team)
                        reactionArray.sort().reverse();
                    });

                for (let i = 0; i < reactionArray.length; i++) {
                    let voteSplit = reactionArray[i].split(' - ')[0]
                    let teamSplit = reactionArray[i].split(' - ')[1]
                    reactionArray[i] = reactionArray[i].replace(voteSplit + ' - ' + teamSplit, teamSplit)
                }

                interaction.channel.send(reactionArray.join('\n'))
            };

            reactionReturns();

        } catch (err) {
            console.log(err)
        }
    }
}
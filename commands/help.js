const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows all the bot commands'),
    
    async execute (interaction) {
        try {
            const embed = new EmbedBuilder()
            .setDescription(`
• **Community Commands**
</help:1045745565251682364> - \`Displays all the current commands\`
</inrole:1043988176173289592> - \`Shows users in a role\`\n
• **Head Staff Commands**
</match:1043795700925878275> - \`Creates a match channel\`
</protest:1043795700925878277> - \`Creates a protest channel\`
</close:1043976467882717265> - \`Closes a protest or match channel\`
</add:1044031783366303745> - \`Adds a user to a match or protest channel\`
</remove:1044031783366303746> - \`Removes a user from a match or protest channel\`\n
• **Administrator Commands**
</accept:1043795700925878272> - \`Accepts a staff application\`
</deny:1043795700925878274> - \`Denies a staff application\`
</promote:1043795700925878276> - \`Promotes a staff member\`
</demote:1043795700925878273> - \`Demotes a staff member\`
</openseeding:1044655886804729887> - \`Creates a seeding vote\`
</closeseeding:1044656064479637524> - \`Ends a seed voting, counts reactions and sorts them\`
</stream:1043795700925878278> - \`Broadcasts a stream link and message to every circuit server\`
            `)
            .setColor('White')
            .setTimestamp()

            await interaction.user.send({ embeds: [embed] }).catch(err => {
                interaction.reply({ content: "Your DMs seem to be disabled. Please enable them so I can message you.", ephemeral: true, fetchReply: true })
            });
            interaction.reply({ content: "Check your DM's. I have sent you something!", ephemeral: true, fetchReply: true })
        } catch (err) {
            console.log(err)
        }
    }
}
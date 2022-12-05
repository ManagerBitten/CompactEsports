const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const owners = ["817817848042487809", "244572365608976384"]

module.exports = {
    data: new SlashCommandBuilder()
    .setName('eval')
    .setDescription('Evaluates Discord.JS code synchronously')
    .addStringOption(option =>
        option
        .setName('code')
        .setDescription('Code to evaluate')
        .setRequired(true)),

    async execute (interaction) {
        if (!owners.includes(interaction.user.id)) return interaction.reply('\`\`\`Owners only.\`\`\`');

        const input = interaction.options.getString('code')

        if (input.includes('config') && !owners.includes(interaction.user.id)) return interaction.reply(`\`[RESTRICTED FILE]\``);

        try {
            const evaled = eval(input);

            const embed = new EmbedBuilder()
                .setColor(0x2f3136)
                .setDescription(require('@discordjs/builders').codeBlock('js', evaled))

            const nembed = new EmbedBuilder()
                .setColor(0x2f3136)
                .setDescription(require('@discordjs/builders').codeBlock('js', '<void>'))

            if (!evaled) {
                interaction.reply({ content: `\`\`\`${input}\`\`\`\n`, embeds: [nembed] })
            } else {
                interaction.reply({ content: `\`\`\`${input}\`\`\`\n`, embeds: [embed] })
            }
        } catch (err) {
            const eembed = new EmbedBuilder()
                .setColor(0xe00001)
                .setDescription(require('@discordjs/builders').codeBlock('js', err.name + ": " + err.message))

            interaction.reply({ embeds: [eembed] });
            console.log(err.name + ": " + err.message);
        }
        }
}
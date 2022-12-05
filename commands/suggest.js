const { SlashCommandBuilder, EmbedBuilder, channelMention, InteractionResponse } = require('discord.js')
const deepl = require('deepl-node');
const authKey = "c1255a36-5486-c9f6-29b0-4ffb1946489a:fx";
const translator = new deepl.Translator(authKey);

module.exports = {
    data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Upload your suggestions')
    .addStringOption(option => 
        option
        .setName('suggestion')
        .setDescription('Your suggestion')
        .setRequired(true))
        .addStringOption(option =>
            option
            .setName('anonymous')
            .setDescription('Decide to remain anonymous or not')
            .setRequired(true)
            .addChoices(
                { name: 'True', value: 'true' },
                { name: 'False', value: 'false' }
            )),

    async execute (interaction) {
        interaction.deferReply({ ephemeral: true })
        const author = interaction.guild.members.cache.get(interaction.user.id);
        const perms = author.roles.highest.position >= interaction.guild.roles.cache.find(r => r.name === "Moderator").position;
        const anon = interaction.options.getString('anonymous');
        let staffSuggestion = interaction.options.getString('suggestion');
        let communitySuggestion = interaction.options.getString('suggestion');
        const translateSuggestion = interaction.options.getString('suggestion');
        const guild = interaction.client.guilds.cache.get('1045945715416895498');
        const staff = guild.channels.cache.get('1047082944252100618');
        const community = guild.channels.cache.get('1047082973935181874');

        if (interaction.guild.name === 'C-OPS Circuit SA') {
            const saResult = await translator.translateText(translateSuggestion, null, 'en-US')
            const enResult = await translator.translateText(translateSuggestion, null, 'pt-BR')
            if (saResult.detectedSourceLang === 'pt') {
                staffSuggestion = `**Original**: ${translateSuggestion}\n**Translated**: ${saResult.text}`
            } else if (enResult.detectedSourceLang === 'en') {
                staffSuggestion = `**Original**: ${translateSuggestion}\n**Translated**: ${enResult.text}`
                communitySuggestion = enResult.text
            }
        }
        if (perms) {
            if (anon === 'true') {

                const embed = new EmbedBuilder()
                .setAuthor({name: 'Anonymous'})
                .setTitle('Staff Suggestions')
                .setDescription(staffSuggestion)
                .setColor(interaction.member.roles.highest.hexColor)
                .setFooter({text: interaction.guild.name, iconURL: interaction.guild.iconURL()})
                .setTimestamp()

                interaction.editReply({ content: 'Thank you for your suggestion, we value any and all positive and constructive feedback!' });
                const message = await staff.send({ embeds: [embed] })
                await message.react('👍')
                await message.react('👎')

            } else if (anon === 'false') {

                const embed = new EmbedBuilder()
                .setAuthor({name: interaction.user.tag + ' - ' + interaction.member.roles.highest.name, iconURL: interaction.user.avatarURL() })
                .setTitle('**Staff Suggestions**')
                .setDescription(staffSuggestion)
                .setColor(interaction.member.roles.highest.hexColor)
                .setFooter({text: interaction.guild.name, iconURL: interaction.guild.iconURL()})
                .setTimestamp()

                interaction.editReply({ content: 'Thank you for your suggestion, we value any and all positive and constructive feedback!' });
                const message = await staff.send({ embeds: [embed] })
                await message.react('👍')
                await message.react('👎')
            }
        } else {
            if (anon === 'true') {

                const embed = new EmbedBuilder()
                .setAuthor({name: 'Anonymous'})
                .setTitle('**Community Suggestions**')
                .setDescription(communitySuggestion)
                .setColor(interaction.member.roles.highest.hexColor)
                .setFooter({text: interaction.guild.name, iconURL: interaction.guild.iconURL()})
                .setTimestamp()

                interaction.editReply({ content: 'Thank you for your suggestion, we value any and all positive and constructive feedback!' });
                const message = await community.send({ embeds: [embed] })
                await message.react('👍')
                await message.react('👎')

            } else if (anon === 'false') {

                const embed = new EmbedBuilder()
                .setAuthor({name: interaction.user.tag + ' - ' + interaction.member.roles.highest.name, iconURL: interaction.user.avatarURL() })
                .setTitle('**Community Suggestions**')
                .setDescription(communitySuggestion)
                .setColor(interaction.member.roles.highest.hexColor)
                .setFooter({text: interaction.guild.name, iconURL: interaction.guild.iconURL()})
                .setTimestamp()

                interaction.editReply({ content: 'Thank you for your suggestion, we value any and all positive and constructive feedback!' });
                const message = await community.send({ embeds: [embed] })
                await message.react('👍')
                await message.react('👎')            
            }
        }
    }
}
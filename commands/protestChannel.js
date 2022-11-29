const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('protest')
    .setDescription('Commands for moderators.')
    .addUserOption(option =>
        option
        .setName('winning-captain')
        .setDescription('Captain for the winning team')
        .setRequired(true))
        .addUserOption(option => 
            option
            .setName('losing-captain')
            .setDescription('Captain for the losing team')
            .setRequired(true)),

    async execute (interaction) {
        try {
            const author = interaction.guild.members.cache.get(interaction.user.id)
            const perms = author.roles.highest.position >= interaction.guild.roles.cache.find(r => r.name === "Head Staff").position
            if (!perms) return interaction.reply({ 
                content: 'You do not have permissions to use this command.', 
                ephemeral: true 
            });
            interaction.deferReply();
            const captain1 = interaction.options.getMember('winning-captain');
            const captain2 = interaction.options.getMember('losing-captain');

            const team1 = captain1.displayName.split(' | ')[0]
            const team2 = captain2.displayName.split(' | ')[0]
            const winnerCategory = interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).find(c => c.name === 'Winner Recordings❗').id
            const loserCategory = interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).find(c => c.name === 'Loser Recordings❗').id

            const embed = new EmbedBuilder()
            .setTitle('__Circuit Guide for recordings__')
            .setDescription(`*1) Uploading of recordings varies depending on the stage of the tournament*\n
*2) Failing to upload a recording might lead to the disqualification of one players' team*\n
*3) you must send a screenshot of uploading every 10 minutes for the first 30 minutes, after that as the rules state. If this is not done accordingly, it might lead to a disqualification.*\n
*4) Gameplay recordings can only be asked for by Staff if deemed necessary.*\n
*5) After the game you have 45 minutes to upload the requested recordings.*\n
*6) Staff can expand the uploading time if the request is accepted or depending on the stage of the tournament*\n
*7) You can speed up your gameplay video by 6x. Your settings recording must not be altered in any way.*`)
            .setColor(0xff0000)

            const winnerChannel = await interaction.guild.channels.create({
                name: team1,
                type: ChannelType.GuildText,
                parent: winnerCategory,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: 'ViewChannel'
                    },
                    {
                        id: interaction.guild.roles.cache.find(r => r.name === 'Head Staff').id,
                        allow: ['SendMessages', 'ViewChannel', 'ReadMessageHistory'],
                        deny: ['MentionEveryone']
                    },
                    {
                        id: captain1.id,
                        allow: ['SendMessages', 'ViewChannel', 'ReadMessageHistory'],
                        deny: ['MentionEveryone']
                    }
                ]
            });

            const loserChannel = await interaction.guild.channels.create({
                name: team2,
                type: ChannelType.GuildText,
                parent: loserCategory,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: 'ViewChannel'
                    },
                    {
                        id: interaction.guild.roles.cache.find(r => r.name === 'Head Staff').id,
                        allow: ['SendMessages', 'ViewChannel', 'ReadMessageHistory'],
                        deny: ['MentionEveryone']
                    },
                    {
                        id: captain2.id,
                        allow: ['SendMessages', 'ViewChannel', 'ReadMessageHistory'],
                        deny: ['MentionEveryone']
                    }
                ]
            });

            winnerChannel.send({
                content: `${captain1} <@${interaction.user.id}>`,
                embeds: [embed]
            });
            
            loserChannel.send({
                content: `${captain2} <@${interaction.user.id}> `,
                embeds: [embed]
            });

            const embed2 = new EmbedBuilder()
            .setDescription('Recording channels have been created.')
            .setColor(0x2f3136)

            interaction.editReply({ embeds: [embed2] })
        } catch (err) {
            console.log(err)
        }
    }
}
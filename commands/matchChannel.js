const { SlashCommandBuilder, ChannelType, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('match')
    .setDescription('Create a match channel')
    .addUserOption(option => 
        option.setName('captain-one')
        .setDescription('Captain of the first team')
        .setRequired(true))
        .addUserOption(option => 
            option.setName('captain-two')
            .setDescription('Captain of the second team')
            .setRequired(true)),

    async execute (interaction) {
        try {
            const author = interaction.guild.members.cache.get(interaction.user.id)
            const perms = author.roles.highest.position >= interaction.guild.roles.cache.find(r => r.name === "Head Staff").position
            if (!perms) return interaction.reply({ 
                content: 'You do not have permissions to use this command.', 
                ephemeral: true 
            });
            const captain1 = interaction.options.getMember('captain-one');
            const captain2 = interaction.options.getMember('captain-two');

            const team1 = captain1.displayName.split(' | ')[0]
            const team2 = captain2.displayName.split(' | ')[0]
            const category = interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).find(c => c.name === 'Matches❗').id

            const embed = new EmbedBuilder()
            .setDescription(`Decide the map(s) and server(s) of your match as soon as the bracket is released according to the Circuit rules.\nSubmit the match information as show in the template below.\n\n> Teams: Team A vs Team B\n> Maps: xxxx, xxxx, xxxx\n> Servers: US-4\n> Captains: @Captain A @Captain B\n> Mod: @Mod\nAfter that, send the information to <#${interaction.guild.channels.cache.find(c => c.name === 'submit-info❗').id}>\n__**Note:**__\n<:CPES:660251865316851751> **If you have any questions do not hesitate to contact an administrator.**`)
            .setColor(0xff0000)

            const channel = await interaction.guild.channels.create({
                name: `${team1}-${team2}`,
                type: ChannelType.GuildText,
                parent: category,
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
                    },
                    {
                        id: captain2.id,
                        allow: ['SendMessages', 'ViewChannel', 'ReadMessageHistory'],
                        deny: ['MentionEveryone']
                    },
                ]
            });
            channel.send({
                content: `${captain1} ${captain2}`,
                embeds: [embed]
            });

            const embed2 = new EmbedBuilder()
            .setDescription('Match channel has been created.')
            .setColor(0x2f3136)

            interaction.reply({ embeds: [embed2] });
        } catch (err) {
            console.log(err)
        }
    }
}
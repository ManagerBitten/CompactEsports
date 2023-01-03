const { Client, GatewayIntentBits, Collection, Partials, ChannelType, EmbedBuilder } = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs');
const path = require('path');
const client = new Client({ 
    intents: [ 
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.GuildMessageReactions 
    ],
    partials: [
        Partials.Reaction,
        Partials.Message,
        Partials.Channel
    ]
});
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

client.on('ready', () => {
    console.log(client.user.tag + ' is online.')
    client.guilds.cache.forEach(server => { 
        server.members.fetch().then((all_users) => {
        });
        server.roles.fetch().then((all_roles) => {
        });
        server.channels.fetch().then((all_channels) => {
        });
    });
    console.log('All users, channels, and roles cached');

    setInterval(() => {
        client.guilds.cache.forEach(server => { 
            server.members.fetch().then((all_users) => {
            });
            server.roles.fetch().then((all_roles) => {
            });
            server.channels.fetch().then((all_channels) => {
            });
        });
        console.log('All users, channels, and roles cached');
    }, 3600000)
});

client.on('guildCreate', (guild) => {
    const channel = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).find(n => n.name === 'staff-news❗');
    const embed = new EmbedBuilder()
    .setTitle('Revamped Compact Esports Bot')
    .setDescription(`
__*Everything show below is the commands supported by this bot. Each category displays which permissions each command requires based on the minimum role required to execute them.*__\n
• **Community Commands**
</help:1045745565251682364> - \`Displays all the current commands\`
</suggest:1047083322620256296> - \`Suggest something to CPES\`
</inrole:1043988176173289592> - \`Shows users in a role\`\n
• **Head Staff Commands**
</match:1043795700925878275> - \`Creates a match channel\`
</protest:1043795700925878277> - \`Creates a protest channel\`
</close:1043976467882717265> - \`Closes a protest or match channel\`
</add:1044031783366303745> - \`Adds a user to a match or protest channel\`
</recording-threads:1049048599411044393> - \`Creates threads for player recordings\`
</remove:1044031783366303746> - \`Removes a user from a match or protest channel\`\n
• **Administrator Commands**
</accept:1043795700925878272> - \`Accepts a staff application\`
</deny:1043795700925878274> - \`Denies a staff application\`
</promote:1043795700925878276> - \`Promotes a staff member\`
</demote:1043795700925878273> - \`Demotes a staff member\`
</open-seeding:1044655886804729887> - \`Creates a seeding vote\`
</close-seeding:1044656064479637524> - \`Ends a seed voting, counts reactions and sorts them\`
</stream:1043795700925878278> - \`Broadcasts a stream link and message to every circuit server\`
            `)
    .setColor('White')
    .setTimestamp()

    if (channel === 'undefined' || channel === 'null') return;
    channel.send({ embeds: [embed] })
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.guildId) return interaction.reply({ content: 'You cannot use this command in DMs.', ephemeral: true });
    if (!interaction.isChatInputCommand()) return;
    try {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        await command.execute(interaction).catch(err => console.error);
    } catch (err) {
        console.log(err)
    }
});

client.login(token);

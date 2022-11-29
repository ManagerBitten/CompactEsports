const { Client, GatewayIntentBits, Collection, ComponentType, Events, Partials } = require('discord.js');
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
    client.guilds.cache.forEach(server => { server.members.fetch().then() });
    client.guilds.cache.forEach(server => { server.roles.fetch().then() });
    client.guilds.cache.forEach(server => { server.channels.fetch().then() });

    client.guilds.cache.forEach(server => { 
        server.members.fetch().then((all_users) => {
        });
    });
    client.guilds.cache.forEach(server => { 
        server.roles.fetch().then((all_roles) => {
        });
    });
    client.guilds.cache.forEach(server => { 
        server.channels.fetch().then((all_channels) => {
        });
    });
    console.log('All users, channels, and roles cached');

    setInterval(() => {
        client.guilds.cache.forEach(server => { 
            server.members.fetch().then((all_users) => {
            });
        });
        client.guilds.cache.forEach(server => { 
            server.roles.fetch().then((all_roles) => {
            });
        });
        client.guilds.cache.forEach(server => { 
            server.channels.fetch().then((all_channels) => {
            });
        });
        console.log('All users, channels, and roles cached');
    }, 3600000)
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

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.guildId) return interaction.reply({ content: 'You cannot use this command in DMs.', ephemeral: true });
    if (!interaction.isContextMenuCommand()) return;
    try {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        await command.execute(interaction).catch(err => console.error)
    } catch (err) {
        console.log(err)
    }
})

client.login(token);
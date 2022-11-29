const fs = require('fs');
const { REST, Routes } = require('discord.js')
const { token, clientId } = require('./config.json')
const commands = [];
const commandFiles = fs.readdirSync('./commands');
for (const file of commandFiles) {
    const stat = fs.lstatSync(`./commands/${file}`)
    if(stat.isDirectory()) {
        const subFiles = fs.readdirSync(`./commands/${file}`)
        for (const subFile of subFiles) {
            const command = require(`./commands/${file}/${subFile}`);
            commands.push(command.data.toJSON());
        }
    } else {
        const command = require(`./commands/${file}`);
        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: 10 }).setToken(token);

rest.put(Routes.applicationCommands(clientId), {
    body: commands
}).then(() => console.log('Application (/) Commands Registered'))
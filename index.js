const { ShardingManager } = require('discord.js');
const { token } = require('./config.json');

const manager = new ShardingManager('./bot.js', { 
    token: token 
});

manager.on('shardCreate', shard => {
    console.log(`Launched Shard: [${shard.id}]`)
});

manager.spawn();

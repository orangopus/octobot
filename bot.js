import { Client, GatewayIntentBits } from 'discord.js';
import fs from 'fs';
import { registerGlobalCommands, handleSlashCommand } from './commandhandler.js';
import packBuild from './package.json' assert { type: 'json' };
import tokenData from './token.json' assert { type: 'json' };

const _VERSION = "v" + packBuild.version;
const _TOKEN = tokenData.token;
const ownerID = "697134824049082438";
const applicationID = "1101246274004590603";

// Initialize the client
const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,       
        GatewayIntentBits.GuildMembers    
    ]
});

// Bot Ready Event
bot.on('ready', async () => {
    console.log(`${bot.user.tag} is booting up...`);
    console.log('Running Bot Version: ' + _VERSION);
    await registerGlobalCommands(applicationID, _TOKEN); // Register commands
});

// Slash Command Handling
bot.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        await handleSlashCommand(interaction);
    }
});

// Connect the bot
bot.login(_TOKEN);

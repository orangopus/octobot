import { Client, GatewayIntentBits } from 'discord.js';
import fs from 'fs';
import { registerGlobalCommands, handleSlashCommand } from './commandhandler.js';
import packBuild from './package.json' assert { type: 'json' };
import tokenData from './token.json' assert { type: 'json' };
import command, { onMessage } from './commands/oranges.js'; // Adjust the path according to your project structure

const _VERSION = "v" + packBuild.version;
const _TOKEN = tokenData.token;
const ownerID = "697134824049082438";
const applicationID = "1101246274004590603";

// Define new bot name and avatar image path
const newNickname = 'OctoBot';
const newAvatarPath = './Avatar.png'; // Path to the new avatar image

const options = {
    owner: '697134824049082438',  // Set your bot owner's ID here
    gameName: 'orangop.us'
};

// Initialize the client
const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,       
        GatewayIntentBits.GuildMembers    
    ]
});

// Track user messages
bot.on('messageCreate', onMessage);

const messageCooldowns = new Map(); // Store message cooldowns
const messageCooldownTime = 1500; // 1.5 seconds

bot.on('messageCreate', (message) => {
    if (message.author.bot) return; // Ignore bot messages

    const userId = message.author.id;
    const now = Date.now();

    if (messageCooldowns.has(userId)) {
        const expirationTime = messageCooldowns.get(userId) + messageCooldownTime;
        if (now < expirationTime) {
            message.delete(); // Delete the message if it's spam
            return;
        }
    }

    // Update the message cooldown
    messageCooldowns.set(userId, now);
});


// Bot Ready Event
bot.on('ready', async () => {
    console.log(`${bot.user.tag} is booting up...`);
    console.log('Running Bot Version: ' + _VERSION);

    // Change bot's username
    bot.guilds.cache.forEach(async (guild) => {
        try {
            const member = await guild.members.fetch(bot.user.id);
            await member.setNickname(newNickname);
            console.log(`Bot nickname changed to: ${newNickname} in guild: ${guild.name}`);
        } catch (error) {
            console.error(`Error changing nickname in guild ${guild.name}:`, error);
        }
    });

    // Change bot's avatar
    try {
        const avatarData = fs.readFileSync(newAvatarPath);
        await bot.user.setAvatar(avatarData);
        console.log(`Bot avatar changed successfully.`);
    } catch (error) {
        console.error('Error changing bot avatar:', error);
    }

    await registerGlobalCommands(applicationID, _TOKEN); // Register commands
});

// Slash Command Handling
bot.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        await handleSlashCommand(interaction, options);
    }
});

// Connect the bot
bot.login(_TOKEN);

import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

// GitHub Webhook Route
app.post('/github-webhook', async (req, res) => {
    const payload = req.body;

    // Check if the push event has the necessary data
    if (payload.ref && payload.head_commit) {
        const repoName = payload.repository.name;
        const commitMessage = payload.head_commit.message;
        const channelId = '1292821973046530130'; // The channel where the threads are created

        // Find the channel
        const channel = await client.channels.fetch(channelId);

        // Check for existing threads
        const existingThreads = await channel.threads.fetchActive();
        const existingThread = existingThreads.threads.find(thread => thread.name.toLowerCase() === repoName.toLowerCase());

        if (existingThread) {
            // Add commit message to the existing thread
            await existingThread.send(`New commit in ${repoName}: ${commitMessage}`);
        }
    }

    res.sendStatus(200); // Respond to GitHub
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Webhook server listening on port ${PORT}`);
});


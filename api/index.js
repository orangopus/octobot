import express from 'express';
import bodyParser from 'body-parser';
import { Client, GatewayIntentBits } from 'discord.js';
import { registerGlobalCommands, handleSlashCommand } from '../commandhandler.js';
import packBuild from './package.json' assert { type: 'json' };
import tokenData from './token.json' assert { type: 'json' };
import axios from 'axios';

// Constants
const PORT = process.env.PORT || 3100;
const APPLICATION_ID = process.env.APPLICATION_ID;
const TOKEN = process.env.TOKEN;

// Initialize express app
const app = express();
app.use(bodyParser.json());

// Initialize Discord bot
const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

// Register global commands
(async () => {
    await registerGlobalCommands(APPLICATION_ID, TOKEN);
})();

// Slash Command Handling
app.post('/interactions', async (req, res) => {
    const interaction = req.body;

    if (interaction.type === 1) {
        // Respond to a ping
        return res.send({ type: 1 });
    }

    if (interaction.type === 2) { // Slash command
        await handleSlashCommand(interaction);
        res.send({ type: 5 }); // Acknowledge the command
    }
});

// Connect the bot
bot.login(TOKEN);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

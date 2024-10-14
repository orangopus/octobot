import express from 'express';
import bodyParser from 'body-parser';
import { Client, GatewayIntentBits } from 'discord.js';
import { registerGlobalCommands, handleSlashCommand } from '../commandhandler.js';
import packBuild from '../package.json' assert { type: 'json' };

// Constants
const PORT = process.env.PORT || 3100;
const APPLICATION_ID = process.env.APPLICATION_ID;
const TOKEN = process.env.TOKEN;

// Initialize express app
const app = express();
app.use(bodyParser.json()); // Parse JSON requests

// Initialize Discord bot
const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Register global commands
(async () => {
    await registerGlobalCommands(APPLICATION_ID, TOKEN);
})();

// Connect the bot
bot.login(TOKEN);

// Handle interactions
app.post('/interactions', async (req, res) => {
    const interaction = req.body;

    // Respond to ping (type 1)
    if (interaction.type === 1) {
        return res.send({ type: 1 }); // Respond with Pong
    }

    // Handle slash commands (type 2)
    if (interaction.type === 2) {
        try {
            await handleSlashCommand(interaction);
            res.send({ type: 5 }); // Acknowledge the command
        } catch (error) {
            console.error('Error handling interaction:', error);
            res.status(500).send({ content: 'There was an error processing your request.' });
        }
    } else {
        res.status(400).send({ content: 'Invalid interaction type.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

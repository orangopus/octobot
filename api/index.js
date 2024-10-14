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
app.post('/api/interactions', async (req, res) => {
    const interaction = req.body;

    // Handle the interaction types
    if (interaction.type === 1) {
        // Respond to a ping
        return res.send({ type: 1 });
    }

    if (interaction.type === 2) { // Slash command
        const commandName = interaction.data.name;
        const command = loadedCommands[commandName]; // Assuming loadedCommands is an object holding your commands

        if (command) {
            try {
                await command.execute(interaction); // Execute the command
                return res.sendStatus(200); // Send a success status
            } catch (error) {
                console.error(`Error executing command ${commandName}:`, error);
                return res.status(500).json({ content: 'There was an error executing that command!' }); // Send error response
            }
        } else {
            return res.status(404).json({ content: 'Unknown command!' }); // Command not found
        }
    }

    // If no matching type
    return res.sendStatus(400); // Bad Request
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

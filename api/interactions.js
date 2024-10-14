import express from 'express';
import { Client, GatewayIntentBits } from 'discord.js';
import { loadCommands } from './commandhandler.js'; // Function to load commands

const app = express();
app.use(express.json());

// Initialize Discord bot
const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

// Load commands dynamically
const loadedCommands = {};

// Handle API interactions
app.post('/api/interactions', async (req, res) => {
    const interaction = req.body;

    // Respond to a ping
    if (interaction.type === 1) {
        return res.send({ type: 1 });
    }

    // Handle slash commands
    if (interaction.type === 2) {
        const commandName = interaction.data.name;
        const command = loadedCommands[commandName];

        if (command) {
            try {
                await command.execute(interaction);
                return res.send({ content: 'Command executed successfully!' }); // Respond to the command execution
            } catch (error) {
                console.error(`Error executing command ${commandName}:`, error);
                return res.status(500).json({ content: 'There was an error executing that command!' });
            }
        } else {
            return res.status(404).json({ content: 'Unknown command!' });
        }
    }

    return res.sendStatus(400); // Bad Request if no matching type
});

// Connect the bot and load commands
(async () => {
    await loadCommands(); // Ensure loaded commands are set correctly
    await bot.login(process.env.TOKEN); // Ensure your token is set in the environment variables
})();

// Start the server
const PORT = process.env.PORT || 3100;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

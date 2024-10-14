import express from 'express';
import { Client, GatewayIntentBits } from 'discord.js';
import { loadCommands } from './commands'; // A function to load commands

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

// Load command files
const loadCommands = async () => {
    const commandFiles = ['./commands/about.js', './commands/test2.js']; // Add all command paths here
    for (const file of commandFiles) {
        const command = (await import(file)).default;
        loadedCommands[command.name] = command;
    }
};

app.post('/api/interactions', async (req, res) => {
    const interaction = req.body;

    if (interaction.type === 1) {
        return res.send({ type: 1 }); // Respond to a ping
    }

    if (interaction.type === 2) { // Handle slash commands
        const commandName = interaction.data.name;
        const command = loadedCommands[commandName];

        if (command) {
            try {
                await command.execute(interaction);
                return; // Exit after executing the command
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
    await loadCommands();
    await bot.login(process.env.TOKEN); // Make sure your token is set in the environment variables
})();

// Start the server
const PORT = process.env.PORT || 3100;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

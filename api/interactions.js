import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  verifyKeyMiddleware,
} from 'discord-interactions';
import dotenv from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadCommands } from "./commandhandler.js"

// Load environment variables
dotenv.config();

const app = express();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Middleware to parse JSON for other routes
app.use(express.json()); // This is for other routes that may require JSON parsing

// Mimic __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load commands from the commands directory
const commandPath = path.join(__dirname, 'commands');
const loadedCommands = {};
const commandList = [];

// Middleware to capture raw body for Discord interactions
app.post('/api/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), (req, res) => {
    const interaction = JSON.parse(req.rawBody); // Use raw body for interaction

    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
        // Check the command name to handle specific commands
        if (interaction.data.name === 'hello') {
            res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: 'Hello world!',
                },
            });
        } else {
            res.sendStatus(400); // If the command is not recognized
        }
    } else {
        res.sendStatus(400); // Optional: handle other interaction types
    }
});

// Log in and start the server
client.login(process.env.TOKEN).then(() => {
    loadCommands(); // Ensure you call your loadCommands function
    app.listen(8999, () => {
        console.log('Example app listening at http://localhost:8999');
        console.log('Guild ID:', process.env.GUILD_ID); // Debugging
    });
}).catch(error => {
    console.error('Error logging in:', error);
});

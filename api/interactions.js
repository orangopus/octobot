import express from 'express';
import {
    InteractionType,
    InteractionResponseType,
    verifyKeyMiddleware,
} from 'discord-interactions';
import dotenv from 'dotenv';
import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const app = express();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Mimic __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load commands from the commands directory
const commandPath = path.join(__dirname, 'commands');
const loadedCommands = [];

// Example loadCommands function
const loadCommands = async () => {
    const files = fs.readdirSync(commandPath).filter(file => file.endsWith('.js')); // Only load .js files

    for (const file of files) {
        const command = (await import(path.join(commandPath, file))).default;

        // Validate command structure
        if (command && command.name && command.description && typeof command.execute === 'function') {
            loadedCommands.push(command); // Store command in loadedCommands array for registration
            console.log(`Loaded command: ${command.name}`);
        } else {
            console.warn(`Command file ${file} is missing required fields. Command:`, command);
        }
    }
};

// Register Slash Commands to Discord
const registerSlashCommands = async () => {
    try {
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

        const slashCommands = loadedCommands.map(command => ({
            name: command.name,
            description: command.description,
            options: command.options // Ensure the command's options are passed if available
        }));

        // Registering commands for a specific guild (you can also use Routes.applicationCommands(clientId) to register globally)
        await rest.put(
            Routes.applicationGuildCommands(process.env.APPLICATION_ID, process.env.GUILD_ID),
            { body: slashCommands }
        );

        console.log('Slash commands registered successfully!');
    } catch (error) {
        console.error('Error registering slash commands:', error);
    }
};

app.post('/api/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async (req, res) => {
    const interaction = req.body; // Access the interaction from the request body
  
    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
        try {
            // Defer the reply immediately
            await fetch(`https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bot ${process.env.TOKEN}`
                },
                body: JSON.stringify({
                    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
                })
            });
  
            // Get the guild ID from the interaction
            const guildId = interaction.guild_id;
            const guild = await client.guilds.fetch(guildId); // Fetch the guild object
            const member = await guild.members.fetch(interaction.member.user.id); // Fetch the member object

            // Extract options from the interaction
            const options = interaction.options || []; // Ensure options are retrieved

            // Now execute the command
            const commandName = interaction.data.name; // Access the command name
            const command = loadedCommands.find(cmd => cmd.name === commandName); // Find the command
            if (command) {
                await command.execute(interaction, client, guild, member, options); // Pass the member object to the command
            }
            res.sendStatus(200);
        } catch (error) {
            console.error(`Error executing command ${interaction.data.name}:`, error);
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(400);
    }
});

// Log in and start the server
client.login(process.env.TOKEN).then(async () => {
    await loadCommands(); // Ensure you call your loadCommands function
    await registerSlashCommands(); // Register the slash commands to Discord
    app.listen(8999, () => {
        console.log('Example app listening at http://localhost:8999');
        console.log('Guild ID:', process.env.GUILD_ID); // Debugging
    });
}).catch(error => {
    console.error('Error logging in:', error);
});

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { REST, Routes } from 'discord.js';

// Mimic __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commandPath = path.join(__dirname, 'commands');
const loadedCommands = {};
const commandList = [];

// Load commands from the commands directory
const loadCommands = async () => {
    const files = fs.readdirSync(commandPath).filter(file => file.endsWith('.js')); // Only load .js files

    for (const file of files) {
        const command = (await import(path.join(commandPath, file))).default;

        // Validate command structure
        if (command && command.name && command.description && typeof command.execute === 'function') {
            // Check for duplicate command names
            if (loadedCommands[command.name]) {
                console.warn(`Duplicate command name detected: ${command.name}`);
                continue; // Skip duplicate commands
            }

            // Store command in loadedCommands
            loadedCommands[command.name] = command;

            // Add command data to commandList
            if (command.data) {
                commandList.push(command.data.toJSON());
                console.log(`Loaded command: ${command.name}`);
            } else {
                console.warn(`Command ${command.name} is missing the data field.`);
            }
        } else {
            console.warn(`Command file ${file} is missing required fields. Command:`, command);
        }
    }
};

// Register global slash commands
async function registerGlobalCommands(applicationID, token) {
    const rest = new REST({ version: '10' }).setToken(token);

    try {
        // Register new commands
        await rest.put(Routes.applicationCommands(applicationID), { body: commandList });
        console.log('Successfully registered global commands.');
    } catch (error) {
        console.error('Error during command registration:', error);
    }
}

// Handle slash commands
async function handleSlashCommand(interaction, options) {
    const { commandName } = interaction;

    if (loadedCommands[commandName]) {
        try {
            await loadedCommands[commandName].execute(interaction, options);
        } catch (error) {
            console.error(`Error executing command ${commandName}:`, error);
            await interaction.reply({ content: 'There was an error executing that command!', ephemeral: true });
        }
    } else {
        await interaction.reply({ content: 'Unknown command!', ephemeral: true });
    }
}

// Load commands on startup
await loadCommands();

// Export functions for use in your main bot file
export { registerGlobalCommands, loadedCommands, handleSlashCommand };

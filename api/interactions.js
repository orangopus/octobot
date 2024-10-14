// /api/interactions.js
import { loadCommands } from '../commandhandler.js'; // Adjust this path to your command handler file
import { REST } from 'discord.js';

let loadedCommands = {};

const loadCommands = async () => {
    // Load commands logic here
};

export default async function handler(req, res) {
    // Log the incoming request body for debugging
    console.log('Received interaction:', req.body);

    // Check if the request method is POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const interaction = req.body;

    // Respond to the PING request
    if (interaction.type === 1) {
        return res.json({ type: 1 }); // Respond with a Pong
    }

    // Handle command interactions (type 2)
    if (interaction.type === 2) {
        const commandName = interaction.data.name; // Get the command name from the request
        const command = loadedCommands[commandName];

        if (!command) {
            return res.status(404).json({ content: 'Unknown command!' });
        }

        try {
            // Create an interaction object to pass to the command
            const interactionResponse = {
                reply: (response) => {
                    return res.json(response);
                },
                member: interaction.member,
                guild: {
                    id: interaction.guild_id,
                },
                client: {
                    user: {
                        id: process.env.BOT_USER_ID, // Your bot's user ID
                    },
                },
            };

            // Execute the command and capture the response
            const commandResponse = await command.execute(interactionResponse);
            
            // Send the command response
            return res.json(commandResponse); // Send the response from the command back to Discord
        } catch (error) {
            console.error(`Error executing command ${commandName}:`, error);
            return res.status(500).json({ content: 'There was an error executing that command!' });
        }
    }

    // If type is not recognized, return an error
    return res.status(400).json({ error: 'Invalid interaction type' });
}

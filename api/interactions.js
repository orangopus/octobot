// /api/interactions.js
import { loadCommands } from './commandhandler.js'; // Adjust this path as necessary
import { loadedCommands } from './commandhandler.js'; // Ensure this exports loaded commands

// Load commands when the server starts
loadCommands();

export default async function handler(req, res) {
    // Check if the request method is POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { type, data } = req.body;

    // Respond to the PING request
    if (type === 1) {
        return res.json({ type: 1 }); // Respond with a Pong
    }

    // Handle command interactions (type 2)
    if (type === 2) {
        const commandName = data.name; // Get the command name from the request
        const command = loadedCommands[commandName]; // Check if command exists

        if (!command) {
            return res.status(404).json({ content: 'Unknown command!' });
        }

        try {
            // Create an interaction object to pass to the command
            const interaction = {
                reply: (response) => {
                    return res.json(response);
                },
                member: req.body.member,
                guild: {
                    id: req.body.guild_id,
                },
                client: {
                    user: {
                        id: process.env.BOT_USER_ID, // Your bot's user ID
                    },
                },
            };

            // Execute the command
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing command ${commandName}:`, error);
            return res.status(500).json({ content: 'There was an error executing that command!' });
        }
    }

    // If type is not recognized, return an error
    return res.status(400).json({ error: 'Invalid interaction type' });
}

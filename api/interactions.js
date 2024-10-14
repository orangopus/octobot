// /api/interactions.js
import { loadCommands } from '../commandhandler.js'; // Adjust this path to your command handler file

// Load commands when the API is initialized
const loadedCommands = await loadCommands();

export default async function handler(req, res) {
    // Log the incoming request body for debugging
    console.log('Received interaction:', req.body);

    // Check if the request method is POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const interaction = req.body;

    // Check the type of interaction
    if (interaction.type === 1) {
        // Respond to a ping
        return res.json({ type: 1 });
    }

    if (interaction.type === 2) { // Slash command
        const commandName = interaction.data.name;
        const command = loadedCommands[commandName];

        if (!command) {
            return res.status(404).json({ content: 'Unknown command!' });
        }

        try {
            // Debugging log: check the interaction object
            console.log('Executing command:', commandName);
            console.log('Interaction data:', interaction);

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
                        id: process.env.BOT_USER_ID,
                    },
                },
            };

            await command.execute(interactionResponse);
        } catch (error) {
            console.error(`Error executing command ${commandName}:`, error);
            return res.status(500).json({ content: 'There was an error executing that command!' });
        }

        return res.sendStatus(200); // Successfully handled the interaction
    }

    // If type is not recognized, return an error
    return res.status(400).json({ error: 'Invalid interaction type' });
}


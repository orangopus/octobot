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
import { handleSlashCommand, registerGlobalCommands, loadCommands } from "./commandhandler.js"

// Load environment variables
dotenv.config();

const app = express();
const client = new Client({
  intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
  ]
});

// Mimic __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load commands from the commands directory
const commandPath = path.join(__dirname, 'commands');
const loadedCommands = {};
const commandList = [];

// Middleware to capture raw body for Discord interactions
app.post('/api/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async (req, res) => {
  const interaction = req.body;

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
      const commandName = interaction.data.name;

      if (loadedCommands[commandName]) {
          try {
              // Acknowledge the interaction with a deferred response
              await res.send({
                  type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
              });

              // Execute the loaded command
              await loadedCommands[commandName].execute(interaction);
          } catch (error) {
              console.error(`Error executing command ${commandName}:`, error);
              await res.send({ content: 'There was an error executing that command!', ephemeral: true });
          }
      } else {
          console.error(`Unknown command: ${commandName}`);
          return res.sendStatus(400); // If the command is not recognized
      }
  } else {
      console.error('Unsupported interaction type:', interaction.type);
      return res.sendStatus(400); // Optional: handle other interaction types
  }
});


// Log in and start the server
client.login(process.env.TOKEN).then(async () => {
    await loadCommands(); // Ensure you call your loadCommands function
    await registerGlobalCommands(client.application.id, process.env.TOKEN); // Pass application ID and token
    app.listen(8999, () => {
        console.log('Example app listening at http://localhost:8999');
        console.log('Guild ID:', process.env.GUILD_ID); // Debugging
    });
}).catch(error => {
    console.error('Error logging in:', error);
});

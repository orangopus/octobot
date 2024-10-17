import { SlashCommandBuilder } from 'discord.js';
import dotenv from "dotenv";

dotenv.config()

const command = {
  name: "slap",
  description: "Slap someone with a trout.",
  options: [
    {
      type: 6, // 6 is the type for USER option
      name: 'user',
      description: 'The user you want to slap',
      required: true
    }
  ],

  async execute(interaction, client, guild, member, options) {
    // Get the user option from the options array
    const targetUserId = interaction.data.options.find(option => option.name === 'user').value;
     // Extract the user ID

    console.log(targetUserId)

    // Construct the response
    const responseMessage = `*slaps <@${targetUserId}> around a bit with a large trout*`; // Use <@userID> for mentioning

    // Send the response back to Discord via a fetch request
    const responseUrl = `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`; // Use interaction.id instead of application_id

            // Respond with the embed
            await fetch(responseUrl, {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bot ${process.env.TOKEN}`
              },
              body: JSON.stringify({
                  content: responseMessage
              })
          });
  }
};

export default command;

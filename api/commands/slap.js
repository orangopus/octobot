import { SlashCommandBuilder } from 'discord.js';

const command = {
  name: "slap",
  description: "Slap someone with a trout.",
  option: new SlashCommandBuilder()
    .setName('slap')
    .setDescription('Slap someone around with a large trout')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('The person to slap')
        .setRequired(true)
    ),

  async execute(interaction) {
    const targetUser = interaction.data.options?.find(option => option.name === 'user')?.getUser()

    // Construct the response
    const responseMessage = `*slaps ${targetUser} around a bit with a large trout*`;

    // Send the response back to Discord via a fetch request
    const responseUrl = `https://discord.com/api/v10/interactions/${interaction.application_id}/${interaction.token}/callback`;

    try {
      await fetch(responseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bot ${process.env.TOKEN}`, // Ensure you are using the bot token from the environment
        },
        body: JSON.stringify(responseMessage)
      });

    } catch (error) {
      console.error('Error sending slap response:', error);
    }
  }
};

export default command;

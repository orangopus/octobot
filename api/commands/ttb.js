import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

// Function to convert text to binary
function text2Binary(textChange) {
  return textChange.split('').map(function (char) {
    return char.charCodeAt(0).toString(2);
  }).join(' ');
}

const command = {
  name: "ttb",
  description: "Converts text to binary",
  data: new SlashCommandBuilder()
    .setName('ttb')
    .setDescription('Convert text to binary')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('The text you want to convert')
        .setRequired(true) // Ensure text is required
    ),
  execute: async (interaction) => {
    // Get the text input from the slash command options
    const textChange = interaction.options.getString('text');

    // Convert the text to binary
    const binaryResult = text2Binary(textChange);

    // Create the embed message
    const embed = new EmbedBuilder()
      .setTitle(":abcd: Text to Binary :zero: :one:")
      .setDescription(`**Result:**\n\`\`\`rb\n${binaryResult}\n\`\`\``)
      .setColor("#00FF00");

    // Send the embed
    await interaction.reply({ embeds: [embed] });
  }
};

export default command;

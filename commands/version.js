import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import packge from '../package.json' assert { type: 'json' };


const command = {
  name: "version",
  description: "Displays the bot's version from package.json.",
  data: new SlashCommandBuilder()
    .setName('version')
    .setDescription("Get the current version of the bot."),

  async execute(interaction) {
    try {
      // Create an embed for the version information
      const embed = new EmbedBuilder()
        .setTitle(`${packge.name} Version Information`)
        .setDescription(packge.description || 'No description available.')
        .setFields({ name: 'Version', value: packge.version, inline: true }) // Correctly adding the field
        .setColor("#7289DA") // Set a color for the embed
        .setFooter({ text: 'Version Info' });

      // Send the embed as a reply
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error reading package.json:", error);
      await interaction.reply("There was an error retrieving the version information.");
    }
  }
};

export default command;

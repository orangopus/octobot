import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

const command = {
  name: "game",
  description: "Set the bot's game status",
  data: new SlashCommandBuilder()
    .setName('game')
    .setDescription('Change the bot’s game status')
    .addStringOption(option =>
      option.setName('game')
        .setDescription('The game to set as the bot’s status')
        .setRequired(false)
    ),

  execute: async function (interaction, options) {
    // Check if the user is the bot owner
    if (interaction.user.id !== options.owner) {
      return interaction.reply({ content: "Only the owner can change the game status.", ephemeral: true });
    }

    const gameChange = interaction.options.getString('game');
    let embed;

    if (gameChange) {
      interaction.client.user.setActivity(gameChange); // Set new game
      embed = new EmbedBuilder()
        .setTitle(":video_game: Game Status Updated")
        .setDescription(`Game has been changed to \`${gameChange}\`.`)
        .setColor("#00FF00");
    } else {
      interaction.client.user.setActivity(options.gameName); // Reset to default
      embed = new EmbedBuilder()
        .setTitle(":video_game: Game Status Reset")
        .setDescription(`Game has been changed back to the default: \`${options.gameName}\`.`)
        .setColor("#00FF00");
    }

    await interaction.reply({ embeds: [embed] });
  }
};

export default command;

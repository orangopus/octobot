import { Embed, EmbedBuilder, SlashCommandBuilder } from 'discord.js';

const command = {
  name: "emotes",
  description: "Displays all custom emotes in the server",
  data: new SlashCommandBuilder()
    .setName('emotes')
    .setDescription('Displays all custom emotes available in the server'),
  execute: async (interaction) => {
    // Fetch custom emotes from the server (guild)
    const emotes = interaction.guild.emojis.cache;

    console.log(emotes)

    // If no custom emotes found
    if (!emotes.size) {
      return interaction.reply("This server has no custom emotes.");
    }

    const embedColor = interaction.guild.members.me.displayColor || '#0099ff';

    // Format the emotes into a string (or paginate if necessary)
    const emotesList = emotes.map(emoji => `${emoji} - \`:${emoji.name}:\``).join('\n');

    // Create an embed
    const embed = new EmbedBuilder()
      .setTitle("Custom Emotes List")
      .setDescription(emotesList)
      .setColor(embedColor);

    // Send the embed
    await interaction.reply({ embeds: [embed] });
  }
}

export default command;
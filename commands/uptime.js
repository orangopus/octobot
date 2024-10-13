import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

function getUptimeString(uptime) {
  if (!uptime) return ":timer: **The bot is currently offline or has just started.**";

  const totalSeconds = Math.floor(uptime / 1000); // Convert milliseconds to seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `:timer: **Current bot uptime since last code update:** \n\`\`\`xl\n${hours} hours, ${minutes} minutes & ${seconds} seconds.\`\`\``;
}

const command = {
  name: "uptime",
  description: "Displays the bot's uptime.",
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription("Displays the bot's uptime."),
  
  async execute(interaction, bot, options) {
    const uptimeMessage = getUptimeString(bot.uptime);
    await interaction.reply(uptimeMessage);
  }
};

export default command;

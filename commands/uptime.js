function getUptimeString(bot) {
  var d = new Date(bot.uptime);
  var h = Math.floor(d.getTime() / 1000 / 3600); // Convert milliseconds to hours
  var m = d.getMinutes();
  var s = d.getSeconds();
  var uptimeString = `:timer: **Current bot uptime since last code update:** \n\`\`\`xl\n${h} hours, ${m} minutes & ${s} seconds.\`\`\``;
  return uptimeString;
}

const command = {
  name: "uptime",
  description: "Displays the bot's uptime.",
  async execute(interaction, bot, options) {
      const uptimeMessage = bot.uptime;
      await interaction.reply(uptimeMessage);
  }
};

export default command;
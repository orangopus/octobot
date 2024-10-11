const command = {
  name: "version",
  description: "version",
  async execute(interaction, bot, options) {
    await interaction.reply("uptimeMessage");
  }
};

export default command;
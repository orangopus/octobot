const command = {
  name: "ping",
  description: "Replies with Pong!",
  execute: async (interaction) => {
      await interaction.reply('Pong!');
  }
};

export default command;

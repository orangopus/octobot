import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

// In-memory storage for user points (use a database in production)
const points = {};
const cooldowns = {}; // Store cooldowns for message activity
const cooldownTime = 30000; // 30 seconds cooldown for message points

// This function will be called whenever a message is sent in the server
function trackUserActivity(message) {
  const userId = message.author.id;

  // Initialize user oranges if they don't exist
  if (!points[userId]) points[userId] = 0;

  const now = Date.now();

  // Check if the user is on cooldown for points incrementing
  if (cooldowns[userId]) {
    const expirationTime = cooldowns[userId] + cooldownTime;
    if (now < expirationTime) {
      return; // User is still on cooldown, do not award points
    }
  }

  // Update the cooldown timestamp
  cooldowns[userId] = now;

  // Add a certain amount of oranges for each active message (e.g., 10 oranges)
  points[userId] += 10; // You can adjust the number of oranges added here
}

// Command definition
const command = {
  name: 'oranges', 
  description: 'Manage user 🍊',
  data: new SlashCommandBuilder()
    .setName('oranges')
    .setDescription('Manage user 🍊')
    .addSubcommand(subcommand =>
      subcommand
        .setName('check')
        .setDescription('Check your 🍊'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add 🍊 to a user.')
        .addUserOption(option =>
          option.setName('user')
            .setDescription('User to add 🍊 to')
            .setRequired(true))
        .addIntegerOption(option =>
          option.setName('amount')
            .setDescription('Amount of 🍊 to add')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('gamble')
        .setDescription('Gamble your 🍊')
        .addIntegerOption(option =>
          option.setName('amount')
            .setDescription('Amount of 🍊 to gamble')
            .setRequired(true))),
  
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const userId = interaction.user.id;

    // Initialize user oranges if they don't exist
    if (!points[userId]) points[userId] = 0;

    // Determine the embed color (use guild color or default to orange)
    const embedColor = interaction.guild?.preferredColor || 0xffa500; // 0xffa500 is orange

    if (subcommand === 'check') {
      // Check user points
      const userPoints = points[userId];

      // Create an embed for the response
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle('Oranges Check')
        .setDescription(`You have ${userPoints} 🍊`)
        .setFooter({ text: 'Keep collecting more!' });

      await interaction.reply({ embeds: [embed] });
    } else if (subcommand === 'add') {
      // Add points to a user
      const userToAdd = interaction.options.getUser('user');
      const amount = interaction.options.getInteger('amount');

      if (!points[userToAdd.id]) points[userToAdd.id] = 0;
      points[userToAdd.id] += amount;

      // Create an embed for the response
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle('Oranges Added')
        .setDescription(`Added ${amount} 🍊 to ${userToAdd.username}.`)
        .setFooter({ text: 'Keep collecting more!' });

      await interaction.reply({ embeds: [embed] });
    } else if (subcommand === 'gamble') {
      // Gamble points
      const gambleAmount = interaction.options.getInteger('amount');

      // Ensure that the gamble amount is positive and greater than 0
      if (gambleAmount <= 0) {
        const embed = new EmbedBuilder()
          .setColor(embedColor)
          .setTitle('Invalid Gamble Amount')
          .setDescription('You must gamble a positive number of 🍊 greater than 0.')
          .setFooter({ text: 'Try again with a valid amount!' });

        return await interaction.reply({ embeds: [embed] });
      }

      // Check if user has enough oranges to gamble
      if (gambleAmount > points[userId]) {
        const embed = new EmbedBuilder()
          .setColor(embedColor)
          .setTitle('Gamble Failed')
          .setDescription("You don't have enough 🍊 to gamble that amount.")
          .setFooter({ text: 'Try again!' });

        return await interaction.reply({ embeds: [embed] });
      }

      // Gamble logic (50% chance to win)
      const win = Math.random() < 0.5; 
      let embed;

      if (win) {
        points[userId] += gambleAmount; // Win
        embed = new EmbedBuilder()
          .setColor(embedColor)
          .setTitle('Gamble Won!')
          .setDescription(`You won! You now have ${points[userId]} 🍊`)
          .setFooter({ text: 'Keep playing!' });
      } else {
        points[userId] -= gambleAmount; // Lose
        embed = new EmbedBuilder()
          .setColor(embedColor)
          .setTitle('Gamble Lost!')
          .setDescription(`You lost! You now have ${points[userId]} 🍊`)
          .setFooter({ text: 'Better luck next time!' });
      }

      await interaction.reply({ embeds: [embed] });
    }
  },
};

// Event listener for message creation to track user activity
export function onMessage(message) {
  // Avoid counting bot messages and messages not in guilds
  if (message.author.bot || !message.guild) return;

  trackUserActivity(message);
}

export default command;

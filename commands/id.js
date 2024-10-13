import { SlashCommandBuilder } from 'discord.js';
import { EmbedBuilder } from 'discord.js';

const command = {
  name: 'id',
  description: 'Get user ID information',
  data: new SlashCommandBuilder()
    .setName('id')
    .setDescription('Get user ID information')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('User to get the ID for')
        .setRequired(false)
    ),

  async execute(interaction) {
    // Retrieve the user option or default to the command user
    const userOption = interaction.options.getUser('user') || interaction.user;

    // Fetch the member from the guild
    const member = await interaction.guild.members.fetch(userOption.id);

    // Create the embed
    const embed = new EmbedBuilder()
      .setTitle(`__**${member.user.username.toUpperCase()}'S OFFICIAL ID CARD - ACCESS CODE: #${member.user.discriminator}**__`)
      .setColor('#0099ff')
      .addFields(
        { name: 'ID', value: member.user.id, inline: true },
        { name: 'Name', value: member.user.username, inline: true },
        { name: 'Status', value: member.presence?.status || 'offline', inline: true },
        { name: 'Current Game', value: member.presence?.activities[0]?.name || 'N/A', inline: true },
        { name: 'Bot', value: member.user.bot ? 'Yes' : 'No', inline: true },
        { name: 'Roles', value: member.roles.cache.size > 0 ? member.roles.cache.map(role => role.name).join(', ') : 'None', inline: true },
        { name: 'Joined', value: `${interaction.guild.name} on ${new Date(member.joinedAt).toLocaleDateString()}`, inline: true },
        { name: 'Created', value: new Date(member.user.createdAt).toLocaleDateString(), inline: true },
      )
      .setThumbnail(member.user.displayAvatarURL())
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

    // Send the embed
    await interaction.reply({ embeds: [embed] });
  },
};

// Export the command
export default command;

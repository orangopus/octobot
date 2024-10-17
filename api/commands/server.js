import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

const command = {
  name: "server",
  description: "Displays server information.",
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription("Get information about the server."),

  async execute(interaction, client) {
    try {
      const guildId = interaction.guild_id;
      const guild = await client.guilds.fetch(guildId); // Fetch the guild using the client

      const msgDate = new Date(guild.createdAt);

      // Create an embed for server information
      const embed = new EmbedBuilder()
        .setTitle(`__**${guild.name.toUpperCase()}'S SERVER INFO:**__`)
        .addFields(
          { name: 'ID', value: guild.id, inline: true },
          { name: 'Name', value: guild.name, inline: true },
          { name: 'Region', value: guild.preferredLocale, inline: true },
          { name: 'Members', value: `${guild.memberCount}`, inline: true },
          { name: 'Text Channels', value: `${guild.channels.cache.filter(channel => channel.type === 0).size}`, inline: true }, // 0 is the type for text channels
          { name: 'AFK Timeout', value: `${guild.afkTimeout} seconds`, inline: true },
          { name: 'Created', value: msgDate.toLocaleDateString(), inline: true }, // Format the date as needed
          { name: 'Avatar', value: `https://discordapp.com/api/guilds/${guild.id}/icons/${guild.icon}.jpg`, inline: true }
        )
        .setColor("#7289DA") // Set a color for the embed
        .setFooter({ text: 'Server Info' });

      // Set the thumbnail (small icon)
      if (guild.icon) {
        embed.setThumbnail(`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`);
      }

      // Send the embed as a reply
                  // Respond with the embed
                  await fetch(`https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bot ${process.env.TOKEN}`
                    },
                    body: JSON.stringify({
                        embeds: [embed]
                    })
                });
    } catch (error) {
      console.error('Error executing the server info command:', error);
      await interaction.reply({ content: 'There was an error fetching the server info.', ephemeral: true });
    }
  }
};

export default command;

import { EmbedBuilder } from 'discord.js';

import { SlashCommandBuilder } from 'discord.js';

const command = {
    name: "guild",
    description: "Shows guild information.",
    execute: async (interaction) => {
        const guild = interaction.guild; // Get the guild from the interaction
        const memberCount = guild.memberCount; // Number of members in the guild
        const msgDate = new Date(guild.createdAt); // Guild creation date
        const guildAvatar = guild.iconURL() || ''; // Guild icon URL

        // Create an embed to reply to the interaction
        const embed = new EmbedBuilder()
            .setTitle(`${guild.name} Guild Information`)
            .setColor(0x0099ff)
            .setDescription(`There are currently **${memberCount} members** in this guild.`)
            .addFields(
                { name: 'Region', value: guild.preferredLocale.toUpperCase(), inline: true }, // Preferred locale instead of region
                { name: 'Text Channels', value: `${guild.channels.cache.filter(channel => channel.type === 0).size}`, inline: true }, // Count only text channels
                { name: 'AFK Timeout', value: `${guild.afkTimeout} seconds`, inline: true }
            )
            .setFooter({ text: `Created on ${msgDate.toLocaleDateString()}` }) // Format date
            .setThumbnail(guildAvatar); // Set guild avatar as thumbnail

        // Reply to the interaction with the embed
        await interaction.reply({ embeds: [embed] });
    }
};

export default command;
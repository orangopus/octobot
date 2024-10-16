import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { InteractionResponseType } from 'discord-interactions';

const command = {
    name: "about",
    description: "Shows information about the bot and server.",
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Shows information about the bot and server.'),
    
    async execute(interaction, client, guild) {
        const options = {
            botVersion: "0.0.4", // Example values, adjust accordingly
            prefix: "/",
            gameName: "Being Awesome"
        };
        
            // Create the embed response
            const embed = new EmbedBuilder()
                .setColor(16748861) // Color in hex
                .setAuthor({
                    name: "Octobot",
                    iconURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.jpg`,
                })
                .setDescription(
                    `**Version:** ${options.botVersion}\n` +
                    `You can get help on the server by typing \`${options.prefix}help\``
                )
                .addFields(
                    { name: "**Currently connected to**", value: `${client.guilds.cache.size} server(s)`, inline: true },
                    { name: "**Current server:**", value: `\`${guild.name}\``, inline: true }, // Access guild name correctly
                    { name: "**Global prefix**", value: `\`${options.prefix}\``, inline: true },
                    { name: "**Current game:**", value: `\`${options.gameName}\``, inline: true },
                    { name: "**Members:**", value: `There are **${guild.memberCount} members** on this guild.`, inline: true } // Access member count correctly
                )
                .setFooter({
                    text: "Coded with 🧡 by the Orangopus community.",
                    iconURL: "https://orangop.us/img/logo.png"
                });
        
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
    }
};

export default command;

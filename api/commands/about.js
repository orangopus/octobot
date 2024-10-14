import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

const command = {
    name: "about",
    description: "Shows information about the bot and server.",
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Shows information about the bot and server.'),
    
    async execute(interaction) {
        const bot = interaction.client; // Access the bot/client from the interaction
        const options = {
            botVersion: "0.0.4", // Example values, adjust accordingly
            prefix: "/",
            gameName: "Being Awesome"
        };

        // Defer the reply to avoid timing out the interaction

        try {
            const embed = new EmbedBuilder()
                .setColor(16748861) // Color in hex
                .setAuthor({
                    name: "Octobot",
                    iconURL: `https://cdn.discordapp.com/avatars/${bot.user.id}/${bot.user.avatar}.jpg`,
                })
                .setDescription(
                    `**Version:** ${options.botVersion}\n` +
                    `You can get help on the server by typing \`${options.prefix}help\``
                )
                .addFields(
                    { name: "**Currently connected to**", value: `${bot.guilds.cache.size} server(s)`, inline: true },
                    { name: "**Current server:**", value: `\`${interaction.guild.name}\``, inline: true },
                    { name: "**Global prefix**", value: `\`${options.prefix}\``, inline: true },
                    { name: "**Current game:**", value: `\`${options.gameName}\``, inline: true },
                    { name: "**Members:**", value: `There are **${interaction.guild.memberCount} members** on this guild.`, inline: true }
                )
                .setFooter({
                    text: "Coded with 🧡 by the Orangopus community.",
                    iconURL: "https://orangop.us/img/logo.png"
                });

            // Edit the deferred reply with the embed
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(`Error executing command about:`, error);
            // Ensure only one reply is sent
            if (!interaction.replied) {
                await interaction.editReply({ content: 'There was an error executing that command!', ephemeral: true });
            }
        }
    }
};

export default command;

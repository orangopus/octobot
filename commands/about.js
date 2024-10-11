import { EmbedBuilder } from 'discord.js';

const command = {
    name: "about",
    description: "Shows information about the bot and server.",
    // Make the execute function asynchronous
    async execute(interaction, bot, options) {
        // Create an embed for the response
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
                iconURL: "https://cdn.discordapp.com/icons/544532292329144322/e6ea9363d5466fa5a8661e1886107eb0.png"
            });

        // Reply to the interaction with the embed
        await interaction.reply({ embeds: [embed] });
    }
};

export default command; // Use ES module export

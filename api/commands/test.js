import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

const command = {
    name: "test",
    description: "Testing hooks",
    data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Testing hooks'),
    execute: async (interaction, bot, options) => {
        // Check if the command is executed in the specified guild
        if (interaction.guild.id === "909627161156132914") {
            // Get member's avatar and nickname
            const memberAvatar = `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.jpg`;
            let nickname = interaction.member.nickname;
            if (!nickname) {
                nickname = interaction.user.username; // Use username if no nickname is set
            }

            // Create an embed response
            const embed = new EmbedBuilder()
                .setTitle(nickname)
                .setDescription(`Do not test me, ${interaction.user.username}!`)
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: memberAvatar,
                })
                .setColor(0x008000) // Green color
                .addFields(
                    {
                        name: "Some extra info.",
                        value: "Some extra value.",
                        inline: true,
                    },
                    {
                        name: "Some more extra info.",
                        value: "Another extra value.",
                        inline: true,
                    }
                );

            // Reply to the interaction with the embed
            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply({ content: "This command can only be used in the specified guild.", ephemeral: true });
        }
    }
};


export default command;
import { EmbedBuilder } from 'discord.js';

const command = {
    name: "test",
    description: "Testing hooks",
    execute: async (interaction, guild) => {
        // Check if the command is executed in the specified guild
        if (guild.id === "909627161156132914") {
            // Get member's avatar and nickname
            const memberAvatar = `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.jpg`;
            let nickname = interaction.member.nick || interaction.member.user.username;

            // Create an embed response
            const embed = new EmbedBuilder()
                .setTitle(nickname)
                .setDescription(`Do not test me, ${interaction.member.user.username}!`)
                .setAuthor({
                    name: interaction.member.user.username,
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
        } else {
            await fetch(`https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bot ${process.env.TOKEN}`
                },
                body: JSON.stringify({
                    content: "This command can only be used in the specified guild."
                })
            });
        }
    }
};

export default command;

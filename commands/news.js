import fetch from 'node-fetch';
import { SlashCommandBuilder } from 'discord.js';
import webhooks from '../hooks.json' assert { type: 'json' };

// Webhook URL for news
const _newsHook = webhooks.newsurl;

const command = {
    name: 'news',
    description: 'Add news to the news feed.',
    data: new SlashCommandBuilder()
        .setName('news')
        .setDescription('Post news to the news feed.')
        .addStringOption(option => 
            option.setName('message')
            .setDescription('The news message to post.')
            .setRequired(true)),  // Require a message input

    async execute(interaction) {
        const guildId = interaction.guild.id;
        const message = interaction.options.getString('message');
        
        // Check if the command is run in the correct guild
        if (guildId === "909627161156132914") {
            const member = interaction.member;
            const memberAvatar = `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.jpg`;
            let username = member.nickname || member.user.username;

            // Check if the member has permission to post
            if (member.permissions.has("KICK_MEMBERS")) {
                const timestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds

                try {
                    // Send a POST request to the webhook
                    await fetch(_newsHook, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            content: "[]()",
                            username: "News Bulletin",
                            avatar_url: memberAvatar,
                            attachments: [
                                {
                                    pretext: message, // Message from the command
                                    color: "#FF913D",
                                    footer: `Posted by ${username}`,
                                    footer_icon: memberAvatar,
                                    ts: timestamp
                                }
                            ]
                        })
                    });

                    // Reply to confirm the news was posted
                    await interaction.reply({ content: "News posted successfully!", ephemeral: true });
                } catch (error) {
                    console.error("Error posting news:", error);
                    await interaction.reply({ content: "There was an error posting the news.", ephemeral: true });
                }
            } else {
                // No permission to post
                await interaction.reply({ content: "You don't have permission to post news.", ephemeral: true });
            }
        } else {
            // Wrong guild
            await interaction.reply({ content: "This command can only be used in the specified guild.", ephemeral: true });
        }
    }
};

export default command;

import { SlashCommandBuilder, WebhookClient, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';

// Webhook URLs
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1294693032750485544/YlPwkYsmZWr4ALwPtdAwfxkdUWoCRJt1rcnZA_zHcAHlAhPAWyj_hpdTNXxWPHahPooL';
const WEBHOOK_URL_WELCOME = "https://discord.com/api/webhooks/1294701243687501948/iKHoAxgK4r8_1K49xse16a2VX7icYbes4tk5ELhAJ1nIiusmgkVFWeYp4x68Z9HGnaMN";
const MARKDOWN_URL = 'https://raw.githubusercontent.com/orangopus/.github/refs/heads/main/CODE_OF_CONDUCT.md';
const MARKDOWN_URL_WELCOME = "https://raw.githubusercontent.com/orangopus/.github/refs/heads/main/profile/README.md";

const command = {
    name: 'publish',
    description: 'Reads from a Markdown file and publishes or updates it in a webhook embed.',
    data: new SlashCommandBuilder()
        .setName('publish')
        .setDescription('Reads from a Markdown file and publishes or updates it in a webhook embed.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('send')
                .setDescription('Publish the Markdown content to the webhooks'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('update')
                .setDescription('Update an existing webhook message with new content')
                .addStringOption(option =>
                    option.setName('message_id')
                        .setDescription('ID of the message to update')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('webhook')
                        .setDescription('Select the webhook to update (rules/welcome)')
                        .setRequired(true))),
    
    async execute(interaction, client) {
        const subcommand = interaction.data.options.find(option => option.type === 1); // Type 1 is for subcommands
        const messageId = interaction.data.options.find(option => option.name === 'message_id')?.value;
        const webhookSelection = interaction.data.options.find(option => option.name === 'webhook')?.value;    

        // Get the guild object from the interaction
    const guildId = interaction.guild_id;
    const guild = await client.guilds.fetch(guildId); // Ensure this is awaited
    const serverIconURL = guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null;
    const embedColor = guild.members.me.displayColor || '#0099ff'; // Use a default color if necessary


        try {
            // Fetch the Markdown files
            const markdownResponse = await fetch(MARKDOWN_URL);
            if (!markdownResponse.ok) throw new Error('Failed to fetch Markdown file');
            const markdownContent = await markdownResponse.text();
            const formattedContent = markdownContent.length > 2048 
                ? markdownContent.substring(0, 2045) + '...' // Discord embed description limit
                : markdownContent;

            const markdownResponseWelcome = await fetch(MARKDOWN_URL_WELCOME);
            if (!markdownResponseWelcome.ok) throw new Error('Failed to fetch welcome Markdown file');
            const markdownContentWelcome = await markdownResponseWelcome.text();
            const formattedContentWelcome = markdownContentWelcome.length > 2048 
                ? markdownContentWelcome.substring(0, 2045) + '...' // Discord embed description limit
                : markdownContentWelcome;

            // Create embeds for both webhooks
            const embedMain = new EmbedBuilder()
                .setDescription(`${formattedContent}`) // Plain text
                .setColor(embedColor) // Use server color
                .setTimestamp()
                .setFooter({
                    text: "Coded with 🧡 by the Orangopus community.",
                    iconURL: "https://orangop.us/img/logo.png"
                });

            const embedWelcome = new EmbedBuilder()
                .setDescription(`${formattedContentWelcome}`) // Plain text
                .setColor(embedColor) // Use server color
                .setTimestamp()
                .setFooter({
                    text: "Coded with 🧡 by the Orangopus community.",
                    iconURL: "https://orangop.us/img/logo.png"
                });

            // Handle 'send' subcommand: Publish the content to webhooks
            if (subcommand === 'send') {
                // Main webhook
                const webhookMain = new WebhookClient({
                    url: WEBHOOK_URL,
                    username: guild.name,
                    avatarURL: serverIconURL,
                });
                await webhookMain.send({
                    embeds: [embedMain],
                    username: guild.name,
                    avatarURL: serverIconURL,
                });

                // Welcome webhook
                const webhookWelcome = new WebhookClient({ url: WEBHOOK_URL_WELCOME });
                await webhookWelcome.send({
                    embeds: [embedWelcome],
                    username: guild.name,
                    avatarURL: serverIconURL,
                });

                await interaction.reply('Content published to both webhooks!');

            // Handle 'update' subcommand: Update an existing webhook message
            } else if (subcommand === 'update') {
                let webhookUrl;
                let embedToUpdate;

                if (webhookSelection === 'rules') {
                    webhookUrl = WEBHOOK_URL;
                    embedToUpdate = embedMain;
                } else if (webhookSelection === 'welcome') {
                    webhookUrl = WEBHOOK_URL_WELCOME;
                    embedToUpdate = embedWelcome;
                } else {
                    return interaction.reply('Invalid webhook selected.');
                }

                // Construct the buttons to add
                const buttons = [
                    {
                        type: 2, // Button type
                        style: 1, // Primary button style
                        label: 'Button 1',
                        custom_id: 'button_1_id',
                    },
                    {
                        type: 2, // Button type
                        style: 2, // Secondary button style
                        label: 'Button 2',
                        custom_id: 'button_2_id',
                    },
                ];

                // Edit the existing message with the new content and buttons
                const response = await fetch(`${webhookUrl}/messages/${messageId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        embeds: [embedToUpdate], // Update the embed
                        components: [
                            {
                                type: 1, // ActionRow type
                                components: buttons, // New buttons
                            },
                        ],
                    }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`Error updating message: ${response.status} ${errorText}`);
                    return interaction.reply('Failed to update the message.');
                }

                await interaction.reply(`Message ${messageId} updated successfully in the ${webhookSelection} webhook.`);
            }
        } catch (error) {
            console.error('Error handling webhook interaction:', error);
            await interaction.reply('Failed to publish or update content.');
        }
    },
};

export default command;

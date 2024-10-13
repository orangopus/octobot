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
    
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const messageId = interaction.options.getString('message_id');
        const webhookSelection = interaction.options.getString('webhook');

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

            // Get the guild (server) color and icon
            const guild = interaction.guild;
            const serverIconURL = guild.iconURL(); // Get the server icon URL
            const embedColor = guild.members.me.displayColor || '#0099ff'; // Get the bot's display color

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
                let webhookClient;
                let embedToUpdate;

                if (webhookSelection === 'rules') {
                    webhookClient = new WebhookClient({ url: WEBHOOK_URL });
                    embedToUpdate = embedMain;
                } else if (webhookSelection === 'welcome') {
                    webhookClient = new WebhookClient({ url: WEBHOOK_URL_WELCOME });
                    embedToUpdate = embedWelcome;
                } else {
                    return interaction.reply('Invalid webhook selected.');
                }

                // Edit the existing message with the new content
                await webhookClient.editMessage(messageId, { embeds: [embedToUpdate] });
                await interaction.reply(`Message ${messageId} updated successfully in the ${webhookSelection} webhook.`);
            }
        } catch (error) {
            console.error('Error handling webhook interaction:', error);
            await interaction.reply('Failed to publish or update content.');
        }
    },
};

export default command;

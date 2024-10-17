import express from 'express';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';
import webhooks from '../../hooks.json' assert { type: 'json' };
import { InteractionType, InteractionResponseType, verifyKeyMiddleware } from 'discord-interactions';

// Initialize the Express app
const app = express();

const _dutyHook = webhooks.agendaurl; // Webhook URL for duty updates

const command = {
    name: 'duty',
    description: 'Changes available/unavailable duty with a reason.',
    data: new SlashCommandBuilder()
        .setName('duty')
        .setDescription('Changes available/unavailable duty with a reason.')
        .addStringOption(option =>
            option.setName('status')
                .setDescription('The duty status (on, idle, off)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the status change')
                .setRequired(false)),

    async execute(interaction, client) {
        const { guildId, token } = interaction;
        const availableRoleId = "1293943779656601791";
        const unavailableRoleId = "1293943830638493767";
        const idleRoleId = "1293963252736462929";
        const guildIdTarget = "909627161156132914"; // Replace with your guild ID
        const targetChannelId = "1294260504369303594"; // Replace with your specific channel ID

        // Fetch the member from the guild
        const guild = await client.guilds.fetch(guildId);
        const member = await guild.members.fetch(interaction.member.user.id); // Ensure you're getting the member object

        const status = interaction.data.options?.find(option => option.name === 'status')?.value;
        const reasonVar = interaction.data.options?.find(option => option.name === 'reason')?.value || 'No reason provided';
        const memberAvatar = member.user.displayAvatarURL(); // Use member's avatar
        const nickname = member.nickname || member.user.username;

        try {
            let responseMessage;

            switch (status) {
                case 'on':
                    await updateDutyStatus(member, availableRoleId, [unavailableRoleId, idleRoleId]);
                    responseMessage = `:white_check_mark: \`Duty status changed to available. Reason: ${reasonVar}. Remember to clock off, ${nickname}!\``;
                    await postToWebhook(interaction, targetChannelId, `${nickname} is now on duty!`, memberAvatar, reasonVar, '#1f9e4a');
                    break;
                case 'idle':
                    await updateDutyStatus(member, idleRoleId, [availableRoleId, unavailableRoleId]);
                    responseMessage = `:white_check_mark: \`Duty status changed to idle. Reason: ${reasonVar}. Remember to clock off, ${nickname}!\``;
                    await postToWebhook(interaction, targetChannelId, `${nickname} is now idle!`, memberAvatar, reasonVar, '#FFA500');
                    break;
                case 'off':
                    await updateDutyStatus(member, unavailableRoleId, [availableRoleId, idleRoleId]);
                    responseMessage = `:white_check_mark: \`Duty status changed to unavailable. Reason: ${reasonVar}. Remember to clock on when you return, ${nickname}!\``;
                    await postToWebhook(interaction, targetChannelId, `${nickname} is now off duty!`, memberAvatar, reasonVar, '#f33838');
                    break;
                default:
                    await displayCurrentDutyStatuses(interaction, guild); // Pass guild for role checking
                    return; // Exit to avoid sending multiple responses
            }

            // Send the response
            await sendResponse(interaction, token, { content: responseMessage });
        } catch (error) {
            console.error('Error executing duty command:', error);
            await sendResponse(interaction, token, { content: 'There was an error while executing the command.', ephemeral: true });
        }
    }
};

// Function to send response to interaction
async function sendResponse(interaction, token, data) {
    try {
        await fetch(`https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bot ${process.env.TOKEN}`
            },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error('Error sending response:', error);
    }
}

// Helper functions
async function updateDutyStatus(member, addRoleId, removeRoleIds) {
    const guildMember = member; // Use the member object passed as a parameter

    // Remove roles from the member
    for (const roleId of removeRoleIds) {
        if (guildMember.roles.cache.has(roleId)) {
            try {
                await guildMember.roles.remove(roleId); // Remove the role
                console.log(`Removed role: ${roleId} from ${guildMember.displayName}`);
            } catch (error) {
                console.error(`Failed to remove role ${roleId}:`, error);
            }
        }
    }

    // Add the new role to the member
    try {
        await guildMember.roles.add(addRoleId); // Add the new role
        console.log(`Added role: ${addRoleId} to ${guildMember.displayName}`);
    } catch (error) {
        console.error(`Failed to add role ${addRoleId}:`, error);
    }
}

async function createWebhook(channel) {
    try {
        const webhook = await channel.createWebhook({
            name: 'Duty Monitor',
            avatar: 'https://i.imgur.com/AfFp7pu.png',
        });
        return webhook;
    } catch (error) {
        console.error('Error creating webhook:', error);
        return null;
    }
}

async function postToWebhook(interaction, targetChannelId, pretext, memberAvatar, reasonVar, color) {
    const channel = await interaction.guild.channels.fetch(targetChannelId);

    if (!channel) {
        console.log('Invalid channel or channel not found!');
        return;
    }

    const webhooks = await channel.fetchWebhooks();
    let webhook = webhooks.find(wh => wh.token);

    if (!webhook) {
        console.log('No webhook found, creating one...');
        webhook = await createWebhook(channel);
        if (!webhook) {
            console.log('Failed to create a webhook.');
            return;
        }
    }

    const embed = new EmbedBuilder()
        .setTitle(pretext || "Duty Status")
        .setDescription(`**Reason**: ${reasonVar || "No reason provided"}`)
        .setColor(parseInt(color.replace('#', ''), 16))
        .setFooter({ text: "Duty Status Update", iconURL: memberAvatar || "" })
        .setTimestamp();

    try {
        await webhook.send({
            content: ' ',
            username: 'Duty Monitor',
            avatarURL: memberAvatar || 'https://i.imgur.com/AfFp7pu.png',
            embeds: [embed.toJSON()],
        });
        console.log("Successfully posted to the webhook.");
    } catch (error) {
        console.error('Failed to post to webhook:', error);
    }
}

async function displayCurrentDutyStatuses(interaction, guild) {
    try {
        const availableRoleId = "1293943779656601791";
        const idleRoleId = "1293963252736462929";
        const unavailableRoleId = "1293943830638493767";

        const availableRole = guild.roles.cache.get(availableRoleId);
        const idleRole = guild.roles.cache.get(idleRoleId);
        const unavailableRole = guild.roles.cache.get(unavailableRoleId);

        if (!availableRole || !idleRole || !unavailableRole) {
            return sendResponse(interaction, interaction.token, { content: 'Error: One or more duty roles do not exist in this server.', ephemeral: true });
        }

        const availableMembersList = availableRole.members.map(member => member.nickname || member.user.username).join(', ') || "No members";
        const idleMembersList = idleRole.members.map(member => member.nickname || member.user.username).join(', ') || "No members";
        const unavailableMembersList = unavailableRole.members.map(member => member.nickname || member.user.username).join(', ') || "No members";

        const responseMessage = `
        **Duty Statuses:**
        - **Available**: ${availableMembersList}
        - **Idle**: ${idleMembersList}
        - **Unavailable**: ${unavailableMembersList}
        `;

        await sendResponse(interaction, interaction.token, { content: responseMessage });
    } catch (error) {
        console.error('Error displaying current duty statuses:', error);
        await sendResponse(interaction, interaction.token, { content: 'There was an error fetching the duty statuses.', ephemeral: true });
    }
}

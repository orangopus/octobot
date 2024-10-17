import express from 'express';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import webhooks from '../../hooks.json' assert { type: 'json' };
import { InteractionType, InteractionResponseType, verifyKeyMiddleware } from 'discord-interactions';
import dotenv from "dotenv";

dotenv.config();

const command = {
    name: 'duty',
    description: 'Changes available/unavailable duty with a reason.',
    options: [
        {
            name: 'status',
            description: 'The duty status (on, idle, off)',
            type: 3, // 3 is the type for STRING option
            required: false,
        },
        {
            name: 'reason',
            description: 'Reason for the status change',
            type: 3, // 3 is the type for STRING option
            required: false,
        }
    ],

    async execute(interaction, client) {
        const guildId = interaction.guild_id

        console.log(guildId)
    
        // Check if guildId is available
        if (!guildId) {
            return await sendResponse(interaction, 'This command can only be used in a server.', true);
        }
    
        const availableRoleId = "1293943779656601791";
        const unavailableRoleId = "1293943830638493767";
        const idleRoleId = "1293963252736462929";
        const targetChannelId = "1294260504369303594"; // Replace with your specific channel ID
    
        let guild;
        try {
            guild = await client.guilds.fetch(guildId);
        } catch (error) {
            console.error('Failed to fetch guild:', error);
            return await sendResponse(interaction, 'Failed to fetch guild information.', true);
        }
    
        // Fetch the member from the guild
        let member;
        try {
            member = await guild.members.fetch(interaction.member.user.id); // Ensure you're getting the member object
        } catch (error) {
            console.error('Failed to fetch member:', error);
            return await sendResponse(interaction, 'Failed to fetch your member information.', true);
        }

        const statusOption = interaction.data?.options?.find(option => option.name === 'status');
        const reasonOption = interaction.data?.options?.find(option => option.name === 'reason');

        const status = statusOption?.value || "N/A";
        const reasonVar = reasonOption?.value || 'No reason provided';
        const memberAvatar = member.user.displayAvatarURL(); // Use member's avatar
        const nickname = member.nickname || member.user.username;
    
        try {
            let responseMessage;
    
            switch (status) {
                case 'on':
                    await updateDutyStatus(member, availableRoleId, [unavailableRoleId, idleRoleId]);
                    responseMessage = `:white_check_mark: \`Duty status changed to available. Reason: ${reasonVar}. Remember to clock off, ${nickname}!\``;
                    await postToWebhook(interaction, client, targetChannelId, `${nickname} is now on duty!`, memberAvatar, reasonVar, '#1f9e4a');
                    break;
                case 'idle':
                    await updateDutyStatus(member, idleRoleId, [availableRoleId, unavailableRoleId]);
                    responseMessage = `:white_check_mark: \`Duty status changed to idle. Reason: ${reasonVar}. Remember to clock off, ${nickname}!\``;
                    await postToWebhook(interaction, client, targetChannelId, `${nickname} is now idle!`, memberAvatar, reasonVar, '#FFA500');
                    break;
                case 'off':
                    await updateDutyStatus(member, unavailableRoleId, [availableRoleId, idleRoleId]);
                    responseMessage = `:white_check_mark: \`Duty status changed to unavailable. Reason: ${reasonVar}. Remember to clock on when you return, ${nickname}!\``;
                    await postToWebhook(interaction, client, targetChannelId, `${nickname} is now off duty!`, memberAvatar, reasonVar, '#f33838');
                    break;
                default:
                    await displayCurrentDutyStatuses(interaction, guild); // Pass guild for role checking
                    return; // Exit to avoid sending multiple responses
            }
    
            // Send the response
            await sendResponse(interaction, responseMessage);
        } catch (error) {
            console.error('Error executing duty command:', error);
            await sendResponse(interaction, 'There was an error while executing the command.', true);
        }
    }
};

// Function to send response to interaction
async function sendResponse(interaction, content, ephemeral = false) {
    const embed = new EmbedBuilder()
        .setTitle('Duty Status Updated')
        .setDescription(content)
        .setTimestamp();

    await fetch(`https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bot ${process.env.TOKEN}`
        },
        body: JSON.stringify({
            embeds: [embed.toJSON()]
        })
    });
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

async function postToWebhook(interaction, client, targetChannelId, pretext, memberAvatar, reasonVar, color) {
    const guild = client.guilds.cache.get(interaction.guild_id); // Get the specific guild from cache

    if (!guild) {
        console.log('Guild not found!');
        return;
    }

    const channel = guild.channels.cache.get(targetChannelId); // Get the target channel from the guild

    if (!channel) {
        console.log('Invalid channel or channel not found!');
        return;
    }

    // Fetch webhooks for the channel
    const webhooks = await channel.fetchWebhooks();
    let webhook = webhooks.find(wh => wh.token); // Find a webhook that has a token

    if (!webhook) {
        console.log('No webhook found, creating one...');
        webhook = await createWebhook(channel); // Create a new webhook if none exists
        if (!webhook) {
            console.log('Failed to create a webhook.');
            return;
        }
    }

    // Create an embed with the duty status
    const embed = new EmbedBuilder()
        .setTitle(pretext || "Duty Status")
        .setDescription(`**Reason**: ${reasonVar || "No reason provided"}`)
        .setColor(parseInt(color.replace('#', ''), 16)) // Convert hex color to integer
        .setFooter({ text: "Duty Status Update", iconURL: memberAvatar || "" })
        .setTimestamp();

    try {
        // Send the webhook with the embed
        await webhook.send({
            content: ' ', // Optional content, can be removed
            username: 'Duty Monitor', // Set the webhook username
            avatarURL: memberAvatar || 'https://i.imgur.com/AfFp7pu.png', // Set the avatar URL
            embeds: [embed.toJSON()], // Add the embed to the webhook
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
            return sendResponse(interaction, 'Error: One or more duty roles do not exist in this server.', true);
        }

        const availableMembersList = availableRole.members.map(member => member.nickname || member.user.username).join(', ') || "No members";
        const idleMembersList = idleRole.members.map(member => member.nickname || member.user.username).join(', ') || "No members";
        const unavailableMembersList = unavailableRole.members.map(member => member.nickname || member.user.username).join(', ') || "No members";

        const responseMessage = `
        **Duty Statuses:** \n:green_circle: **Available**: \n${availableMembersList} \n:yellow_circle: **Idle**: \n${idleMembersList} \n:red_circle: **Unavailable**: \n${unavailableMembersList}
        `;

        await sendResponse(interaction, responseMessage);
    } catch (error) {
        console.error('Error displaying current duty statuses:', error);
        await sendResponse(interaction, 'There was an error fetching the duty statuses.', true);
    }
}

export default command;
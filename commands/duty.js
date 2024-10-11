import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';
import webhooks from '../hooks.json' assert { type: 'json' };

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
    
    async execute(interaction) {
        const { member, guildId } = interaction;
        const availableRoleId = "1293943779656601791";
        const unavailableRoleId = "1293943830638493767";
        const idleRoleId = "1293963252736462929";
        const guildIdTarget = "909627161156132914"; // Replace with your guild ID
        const targetChannelId = "1294260504369303594"; // Replace with your specific channel ID

        const status = interaction.options.getString('status');
        const reasonVar = interaction.options.getString('reason') || 'No reason provided';
        const memberAvatar = member.user.displayAvatarURL();
        const nickname = member.nickname || member.user.username;

        await interaction.deferReply();

        if (interaction.guildId !== guildIdTarget) {
            return interaction.editReply({ content: "This command can only be used in the designated guild.", ephemeral: true });
        }

        try {
            if (status === 'on') {
                await updateDutyStatus(member, availableRoleId, [unavailableRoleId, idleRoleId]);
                await interaction.editReply(`:white_check_mark: \`Duty status changed to available. Reason: ${reasonVar}. Remember to clock off, ${nickname}!\``);
                await postToWebhook(interaction, targetChannelId, `${nickname} is now on duty!`, memberAvatar, reasonVar, '#1f9e4a');

            } else if (status === 'idle') {
                await updateDutyStatus(member, idleRoleId, [availableRoleId, unavailableRoleId]);
                await interaction.editReply(`:white_check_mark: \`Duty status changed to idle. Reason: ${reasonVar}. Remember to clock off, ${nickname}!\``);
                await postToWebhook(interaction, targetChannelId, `${nickname} is now idle!`, memberAvatar, reasonVar, '#FFA500');

            } else if (status === 'off') {
                await updateDutyStatus(member, unavailableRoleId, [availableRoleId, idleRoleId]);
                await interaction.editReply(`:white_check_mark: \`Duty status changed to unavailable. Reason: ${reasonVar}. Remember to clock on when you return, ${nickname}!\``);
                await postToWebhook(interaction, targetChannelId, `${nickname} is now off duty!`, memberAvatar, reasonVar, '#f33838');

            } else {
                await displayCurrentDutyStatuses(interaction);
            }
        } catch (error) {
            console.error('Error executing duty command:', error);
            await interaction.editReply({ content: 'There was an error while executing the command.', ephemeral: true });
        }
    }
};

// Helper function to update duty status
async function updateDutyStatus(member, addRoleId, removeRoleIds) {
    const guildMember = await member.guild.members.fetch(member.id);

    for (const roleId of removeRoleIds) {
        if (guildMember.roles.cache.has(roleId)) {
            await guildMember.roles.remove(roleId).catch(console.error);
        }
    }
    await guildMember.roles.add(addRoleId).catch(console.error);
}

async function createWebhook(channel) {
    try {
        const webhook = await channel.createWebhook({
            name: 'Duty Monitor',
            avatar: 'https://i.imgur.com/AfFp7pu.png', // Set your desired avatar URL
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
            return; // Exit if we couldn't create a webhook
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

// Function to display current duty statuses
async function displayCurrentDutyStatuses(interaction) {
    try {
        const availableRoleId = "1293943779656601791";
        const idleRoleId = "1293963252736462929";
        const unavailableRoleId = "1293943830638493767";

        const guild = interaction.guild;

        const availableRole = guild.roles.cache.get(availableRoleId);
        const idleRole = guild.roles.cache.get(idleRoleId);
        const unavailableRole = guild.roles.cache.get(unavailableRoleId);

        if (!availableRole || !idleRole || !unavailableRole) {
            return interaction.editReply({ content: 'Error: One or more duty roles do not exist in this server.', ephemeral: true });
        }

        const availableMembersList = availableRole.members.map(member => member.nickname || member.user.username).join(', ') || "No members";
        const idleMembersList = idleRole.members.map(member => member.nickname || member.user.username).join(', ') || "No members";
        const unavailableMembersList = unavailableRole.members.map(member => member.nickname || member.user.username).join(', ') || "No members";

        const dutyStatusEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Team Duty Statuses')
            .setDescription('Here are the current duty statuses of the team members:')
            .addFields(
                { name: `**:green_circle: On Duty (${availableRole.members.size})**`, value: availableMembersList, inline: false },
                { name: `**:yellow_circle: Idle (${idleRole.members.size})**`, value: idleMembersList, inline: false },
                { name: `**:red_circle: Off Duty (${unavailableRole.members.size})**`, value: unavailableMembersList, inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'Duty status updated', iconURL: guild.iconURL() });

        await interaction.editReply({ embeds: [dutyStatusEmbed] });
    } catch (error) {
        console.error('Error displaying duty statuses:', error);
        await interaction.editReply({ content: 'There was an error fetching duty statuses.', ephemeral: true });
    }
}

export default command;

import { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import fetch from 'node-fetch';

const command = {
    name: "githubrepos",
    description: "Automatically create threads for GitHub repositories in a specific thread channel.",
    data: new SlashCommandBuilder()
        .setName('githubrepos')
        .setDescription('Fetch and create threads for repositories from a GitHub user/org'),

    async execute(interaction) {
        console.log("Command executed: githubrepos");
        const username = 'orangopus'; // Replace with the GitHub username or org
        const channelId = '1292821973046530130'; // Replace with the ID of the thread channel

        // Acknowledge the interaction immediately
        await interaction.reply({ content: 'Fetching repositories...', ephemeral: true });

        try {
            // Fetch repositories from GitHub
            const response = await fetch(`https://api.github.com/orgs/${username}/repos`);
            if (!response.ok) {
                throw new Error(`GitHub API returned an error: ${response.statusText}`);
            }
            const repos = await response.json();

            // Handle no repositories found
            if (!Array.isArray(repos) || repos.length === 0) {
                await interaction.followUp({ content: `No repositories found for GitHub user/org: ${username}.` });
                return;
            }

            // Build the dropdown (Select Menu) with repositories
            const options = repos.map(repo => new StringSelectMenuOptionBuilder()
                .setLabel(repo.name)
                .setValue(repo.name)
            );

            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('select_exclude_repos')
                        .setPlaceholder('Select repositories to exclude')
                        .addOptions(options)
                        .setMinValues(1)
                        .setMaxValues(repos.length) // Allow excluding multiple repositories
                );

            // Send the dropdown menu to the user
            await interaction.followUp({
                content: 'Select repositories to exclude from thread creation:',
                components: [row],
                ephemeral: true
            });

            // Set up a filter and collector for the dropdown selection
            const filter = i => i.customId === 'select_exclude_repos' && i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async i => {
                const excludedRepos = i.values.map(value => value.toLowerCase()); // Get selected repos to exclude

                await i.deferUpdate(); // Acknowledge the interaction

                // Fetch existing threads
                const channel = await interaction.guild.channels.fetch(channelId);
                const existingThreads = await channel.threads.fetchActive();
                const existingThreadNames = existingThreads.threads.map(thread => thread.name.toLowerCase());

                let alreadyExists = [];
                let newlyCreated = [];
                let repoButtons = [];

                // Create threads for each repository if they don't already exist and aren't excluded
                for (const repo of repos) {
                    if (existingThreadNames.includes(repo.name.toLowerCase())) {
                        alreadyExists.push(repo.name); // Add to list of repos that already have threads
                        continue; // Skip if the thread already exists
                    }

                    // Skip the excluded repositories
                    if (excludedRepos.includes(repo.name.toLowerCase())) {
                        continue; // Skip if it's an excluded repository
                    }

                    try {
                        await channel.threads.create({
                            name: repo.name,
                            message: `https://github.com/orangopus/${repo.name}`,
                        });
                        newlyCreated.push(repo.name); // Add to list of newly created threads
                        repoButtons.push(
                            new ButtonBuilder()
                                .setLabel(repo.name)
                                .setStyle(ButtonStyle.Link)
                                .setURL(`https://github.com/orangopus/${repo.name}`)
                        );
                        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay for 1 second
                    } catch (error) {
                        await interaction.followUp({ content: `Error creating thread for repo ${repo.name}: ${error.message}`, ephemeral: true });
                    }
                }

                // Construct the embed message with bold text
                const embed = new EmbedBuilder()
                    .setTitle('GitHub Repositories - Thread Creation Summary')
                    .setColor('#0099ff')
                    .setTimestamp()
                    .setFooter({
                        text: 'Coded with 🧡 by the Orangopus community.',
                        iconURL: 'https://orangop.us/img/logo.png'
                    });

                // Add fields for newly created and already existing threads
                if (newlyCreated.length > 0) {
                    embed.addFields({ name: '🆕 Newly Created Threads:', value: `${newlyCreated.join(', ')}**` });
                }
                if (alreadyExists.length > 0) {
                    embed.addFields({ name: '✅ Already Existing Threads:', value: `${alreadyExists.join(', ')}` });
                }
                if (excludedRepos.length > 0) {
                    embed.addFields({ name: '❌ Excluded Repositories:', value: `${excludedRepos.join(', ')}` });
                }

                // Create action row for the buttons
                const buttonRow = new ActionRowBuilder().addComponents(repoButtons);

                // Send final message with embed and buttons
                await interaction.followUp({ 
                    content: 'Here is the thread creation summary:', 
                    embeds: [embed], 
                    components: repoButtons.length > 0 ? [buttonRow] : [], // Only send buttons if any were created
                });
            });

            collector.on('end', async collected => {
                if (collected.size === 0) {
                    await interaction.editReply({ content: 'No repositories were excluded.', components: [] });
                }
            });

        } catch (error) {
            await interaction.followUp({ content: `There was an error: ${error.message}`, ephemeral: true });
        }
    }
};

export default command;
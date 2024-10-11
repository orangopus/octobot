import { SlashCommandBuilder } from 'discord.js';
import fetch from 'node-fetch';

const command = {
    name: "collective",
    description: "Get budget information, collective name, and more.",
    data: new SlashCommandBuilder()
        .setName('collective')
        .setDescription('Get budget info and contributors from Orangopus Collective')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of information to retrieve (e.g. members)')
                .setRequired(false)), // Optional argument for type of info (e.g., members)

    async execute(interaction) {
        await interaction.deferReply(); // Acknowledge the interaction immediately

        const type = interaction.options.getString('type'); // Get user input for optional argument

        try {
            if (!type) {
                const response = await fetch("https://opencollective.com/orangopus.json");
                const data = await response.json();

                let orgBalance = "£" + parseFloat(Math.round(data.balance * 100) / 10000).toFixed(2);
                let orgBudget = "£" + parseFloat(Math.round(data.yearlyIncome * 100) / 10000).toFixed(2);

                const embed = {
                    description: `You can view the collective by [clicking here](https://opencollective.com/${data.slug})\n\n`,
                    author: {
                        name: "Orangopus' Collective",
                        icon_url: "https://orangop.us/img/logo.png"
                    },
                    fields: [
                        { name: "**Current Balance 🏧**", value: orgBalance, inline: true },
                        { name: "**Est. Annual Budget 📅**", value: orgBudget, inline: true },
                        { name: "**Total Contributors 💡**", value: data.contributorsCount, inline: true },
                        { name: "**Total Backers 💰**", value: data.backersCount, inline: true }
                    ],
                    footer: {
                        text: "Powered by OpenCollective",
                        icon_url: "https://opencollective.com/favicon.png"
                    },
                    color: 0xff6347
                };

                await interaction.editReply({ embeds: [embed] });

            } else if (type === "members") {
                const response = await fetch("https://opencollective.com/orangopus/members.json");
                const backers = await response.json();

                const embed = {
                    description: "**RECENT MEMBERS:**\n\n" +
                        backers.slice(0, 5).map(b => `**Name:** [${b.name}](${b.profile})\n**Role:** ${b.role}\n**Total Amount Donated: ** $${b.totalAmountDonated}\n\n`).join(''),
                    author: {
                        name: "Orangopus' Collective",
                        icon_url: "https://cdn.discordapp.com/icons/544532292329144322/e6ea9363d5466fa5a8661e1886107eb0.png"
                    },
                    color: 0xff6347
                };

                await interaction.editReply({ embeds: [embed] });

            } else {
                await interaction.editReply({ content: "Invalid argument. Please specify a valid option." });
            }

        } catch (error) {
            console.error("Error fetching data from OpenCollective:", error);
            await interaction.editReply({ content: `Sorry, there was an error retrieving the information: ${error.message}`, ephemeral: true });
        }
    }
};

export default command;

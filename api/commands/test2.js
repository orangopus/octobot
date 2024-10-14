import { SlashCommandBuilder } from 'discord.js';

export default {
    name: 'test2',
    description: '2nd test for Vercel Serverless Functions.',
    data: new SlashCommandBuilder()
        .setName('test2')
        .setDescription('2nd test for Vercel Serverless Functions.'),
        
    async execute(interaction) {
        console.log('Executing test command...'); // Log command execution

        try {
            // Ensure no previous replies have been sent
            if (!interaction.replied) {
                await interaction.reply({ content: 'Test command executed successfully!' });
            }
        } catch (error) {
            console.error('Error executing test command:', error);
            // If an error occurs, reply with an error message if not already replied
            if (!interaction.replied) {
                await interaction.reply({ content: 'There was an error executing that command!', ephemeral: true });
            }
        }
    },
};

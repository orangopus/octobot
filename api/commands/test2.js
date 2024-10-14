const command = {
    name: 'test2',
    description: '2nd test for Vercel Serverless Functions.',
    execute: async (interaction) => {
        console.log('Executing test command...'); // Log command execution
        await interaction.reply({ content: 'Test command executed successfully!' });
    },
};

export default command;

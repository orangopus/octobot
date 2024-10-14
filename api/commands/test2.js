const command = {
    name: 'test2',
    execute: async (interaction) => {
        console.log('Executing test command...'); // Log command execution
        await interaction.reply({ content: 'Test command executed successfully!' });
    },
};

export default command;

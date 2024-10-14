// commandhandler.js
import fs from 'fs';
import path from 'path';

const commandPath = path.join(__dirname, 'commands');
const loadedCommands = {};

export const loadCommands = async () => {
    const files = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));
    for (const file of files) {
        const command = (await import(path.join(commandPath, file))).default;
        if (command && command.name) {
            loadedCommands[command.name] = command;
            console.log(`Loaded command: ${command.name}`);
        } else {
            console.warn(`Command file ${file} is missing required fields.`);
        }
    }
};

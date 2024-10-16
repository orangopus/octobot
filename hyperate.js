import { SlashCommandBuilder } from 'discord.js';
import WebSocket from 'ws';

const apiToken = "pdcXMcD5noL8rqs1FNQP4ZHZ68T6c1P6E85vVAD7cgbYDqrIgumPHLilYR4LCGHH"; // Load your API token from an environment variable

class HypeRateWebsocket {
    constructor({ apiKey, initialChannel }) {
        this.apiKey = apiKey;
        this.ws = null;
        this.currentChannel = initialChannel || null;
        this.generalListeners = [];
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(`wss://app.hyperate.io/socket/websocket?token=${this.apiKey}`, {
                rejectUnauthorized: true, // Set to true in production
                perMessageDeflate: false,
            });

            this.ws.onopen = () => {
                console.log('WebSocket connection opened.');
                this.joinChannel(this.currentChannel); // Join the specified channel
                resolve();
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                reject(error);
            };

            this.ws.onclose = () => {
                console.log('WebSocket connection closed.');
            };

            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log('Received message:', data);
                this.handleMessage(data);
            };
        });
    }

    joinChannel(channelId) {
        if (!channelId) return; // Exit if no channel ID is provided

        const message = {
            topic: `hr:${channelId}`,
            event: 'phx_join',
            payload: {},
            ref: 0
        };
        this.sendMessage(message);
    }

    handleMessage(data) {
        if (data.event === 'hr_update') {
            const heartbeat = data.payload.hr;
            const channel = data.topic;

            // Notify all registered listeners
            this.generalListeners.forEach((listener) => {
                listener(channel, heartbeat);
            });
        }
    }

    startHeartbeatTimer() {
        setInterval(() => {
            const message = {
                topic: 'phoenix',
                event: 'heartbeat',
                payload: {},
                ref: 0
            };
            this.sendMessage(message);
        }, 10000); // Send heartbeat every 10 seconds
    }

    sendMessage(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }

    addGeneralListener(callback) {
        this.generalListeners.push(callback);
    }

    removeGeneralListener(callback) {
        this.generalListeners = this.generalListeners.filter(listener => listener !== callback);
    }

    leaveChannel(channelId) {
        const message = {
            topic: `hr:${channelId}`,
            event: 'phx_leave',
            payload: {},
            ref: 0
        };
        this.sendMessage(message);
    }
}

// Initialize a single HypeRateWebsocket instance
const hyperateSocket = new HypeRateWebsocket({ apiKey: apiToken, initialChannel: 'internal-testing' });

// Connect the WebSocket once at bot startup
hyperateSocket.connect().then(() => {
    console.log('HypeRate WebSocket connected.');
    hyperateSocket.startHeartbeatTimer(); // Start sending keep-alive packets
}).catch(console.error);

// Discord command to fetch heart rate
const command = {
    name: "hyperate",
    description: "Fetches the current heart rate from a HypeRate user.",
    data: new SlashCommandBuilder()
        .setName('hyperate')
        .setDescription('Fetch the current heart rate of a HypeRate user.')
        .addStringOption(option =>
            option.setName('user')
                .setDescription('The HypeRate user ID')
                .setRequired(true)),
    
    async execute(interaction) {
        const userId = interaction.options.getString('user'); // Get the user ID from command options
        let hasReplied = false;

        // Acknowledge the interaction
        await interaction.reply({ content: `Fetching heart rate for HypeRate user: ${userId}...`, ephemeral: true });
        hasReplied = true;

        // Add a listener for heart rate updates
        const listener = (channel, heartbeat) => {
            if (hasReplied) {
                interaction.followUp({
                    content: `HypeRate user **${userId}** currently has a heart rate of **${heartbeat} BPM**.`,
                    ephemeral: true
                });
                hyperateSocket.removeGeneralListener(listener); // Remove listener after responding
            }
        };

        hyperateSocket.addGeneralListener(listener); // Register the listener

        // Set a timeout to handle no response cases
        setTimeout(async () => {
            if (hasReplied) {
                await interaction.followUp({
                    content: `No heart rate updates received for user **${userId}**. Please try again later.`,
                    ephemeral: true
                });
            }
        }, 30000); // 30-second timeout
    }
};

export default command;

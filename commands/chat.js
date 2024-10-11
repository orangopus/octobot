import { SlashCommandBuilder } from 'discord.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google Generative AI with your API key from an environment variable
const genAI = new GoogleGenerativeAI("AIzaSyB2dx00TilXiYl0Oj0KNBGqOy04K-l9p4k");
const MODEL_NAME = "gemini-pro";

class GoogleGenerativeAIResponseError extends Error {
    constructor(message, response) {
        super(message);
        this.response = response;
        this.name = "GoogleGenerativeAIResponseError";
    }
}

// Check if the finish reason of the response is bad
const hadBadFinishReason = (candidate) => {
    return candidate && candidate.finishReason === 'BAD_FINISH';
};

// Extract text from the response
const getText = async (response) => {
    if (response.candidates && response.candidates.length > 0) {
        const candidateText = await response.text(); // Call the function to get text
        return candidateText || ""; // Return text or empty string
    }
    return ""; // Return empty string if no candidates
};

const processResponse = async (response) => {
    if (response && response.candidates && Array.isArray(response.candidates)) {
        if (response.candidates.length > 1) {
            console.warn(`This response had ${response.candidates.length} candidates. Returning text from the first candidate only.`);
        }
        const candidate = response.candidates[0];
        if (hadBadFinishReason(candidate)) {
            throw new GoogleGenerativeAIResponseError(`Bad finish reason detected.`, response);
        }
        const text = await getText(response);
        if (!text || !text.trim()) {
            console.warn("AI returned an empty response.");
            return "The AI did not generate a valid response."; // Updated message
        }
        return text; // Return the extracted text
    } else if (response && response.promptFeedback) {
        throw new GoogleGenerativeAIResponseError(`Text not available.`, response);
    }
    return "The AI encountered an issue generating a response."; // Updated message
};

const command = {
    name: "chat",
    description: "Engage in a chat with Google Generative AI",
    data: new SlashCommandBuilder()
        .setName('chat')
        .setDescription('Start a conversation with Google Generative AI')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Your message to Google Generative AI')
                .setRequired(true)), // Add a string option for user input

    async execute(interaction) {
        await interaction.deferReply(); // Acknowledge the interaction immediately

        const userMessage = interaction.options.getString('message');
        console.log(`User Message: "${userMessage}"`); // Log user message

        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        
        const parts = [
            {
                text: `input: ${userMessage}`,
            },
        ];

        const generationConfig = {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        };

        try {
            console.log("Requesting AI with contents:", parts);
            const result = await model.generateContent({
                contents: [{ role: "user", parts }],
                generationConfig,
            });

            console.log("AI Response:", result); // Log full AI response
            const reply = await processResponse(result.response); // Await the processed response
            console.log(`Google Generative AI Response: "${reply}"`);

            // Check if the reply is valid and not empty
            if (!reply || !reply.trim()) {
                await interaction.editReply({ content: "The AI did not generate a valid response.", ephemeral: true });
                return; // Early return to prevent further execution
            }

            if (reply.length > 2000) {
                const replyArray = reply.match(/[\s\S]{1,2000}/g); // Split into chunks of 2000 characters
                for (const msg of replyArray) {
                    await interaction.followUp(msg); // Using followUp for multiple messages
                }
                return;
            }

            await interaction.editReply(reply); // Edit the deferred reply with the final message

        } catch (error) {
            console.error("Error during Google Generative AI API call:", error);
            const errorMessage = error.response ? error.response.data : error.message; // More detailed error
            await interaction.editReply({ content: `Sorry, there was an error: ${errorMessage}`, ephemeral: true });
        }
    }
};

export default command; // Use ES module export

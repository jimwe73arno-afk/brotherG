// File: functions/gemini.js (ES Module Syntax)
import { GoogleGenAI } from '@google/genai';

// Load API Key securely from Environment variables
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

// Function to handle the chat request
exports.handler = async (event) => {
    try {
        if (event.httpMethod !== 'POST') {
            // This error is OK, it means the server is running
            return { 
                statusCode: 405, 
                headers: { "Access-Control-Allow-Origin": "*" }, 
                body: JSON.stringify({ error: "Method Not Allowed" }) 
            };
        }

        const body = JSON.parse(event.body);
        const userMessage = body.message;
        
        if (!userMessage) {
            return { statusCode: 400, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ error: "No message provided." }) };
        }
        
        // --- GEMINI API CALL ---
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { 
                    role: "user", 
                    parts: [{ text: `You are the AI assistant for Prime Freelance IT. Answer this question professionally, concisely, and ONLY based on general IT services knowledge: ${userMessage}` }] 
                }
            ],
        });
        
        // Return the AI's response
        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ aiResponse: response.text }),
        };

    } catch (error) {
        console.error("Internal Error:", error);
        return { 
            statusCode: 500, 
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: "Sorry, the AI system is currently unavailable." }),
        };
    }
};

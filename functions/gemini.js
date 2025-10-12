// File: functions/gemini.js 
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

exports.handler = async (event) => {
    try {
        if (event.httpMethod !== 'POST') {
            return { statusCode: 405, body: 'Method Not Allowed' };
        }

        const body = JSON.parse(event.body);
        const userMessage = body.message;
        
        if (!userMessage) {
            return { statusCode: 400, body: JSON.stringify({ error: "No message provided." }) };
        }
        
        // --- GEMINI API CALL ---
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { 
                    role: "user", 
                    parts: [{ text: `You are the AI assistant for Prime Freelance IT. Answer this question professionally: ${userMessage}` }] 
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

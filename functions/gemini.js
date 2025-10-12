```javascript
// File: functions/gemini.js
const { GoogleGenAI } = require('@google/genai');

// This is the core function. The API Key is loaded securely.
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

exports.handler = async (event) => {
    try {
        // Check if request is POST
        if (event.httpMethod !== 'POST') {
            return { statusCode: 405, body: 'Method Not Allowed' };
        }

        // Get the user's message from the request
        const { message } = JSON.parse(event.body);
        
        // Call Gemini API (using a fast model)
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { 
                    role: "user", 
                    parts: [{ text: `You are the AI assistant for Prime Freelance IT. Answer this question professionally, concisely, and ONLY based on general knowledge for IT services: ${message}` }] 
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
        // Console log the error for debugging in Netlify logs
        console.error("Gemini API Error:", error);
        return { 
            statusCode: 500, 
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: "Sorry, the AI is having trouble right now. Please try again." }),
        };
    }
};
```

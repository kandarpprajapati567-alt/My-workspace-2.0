const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
// Render अपने आप एक PORT असाइन करता है, इसलिए process.env.PORT लिखना बहुत जरूरी है
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// आपकी index.html और स्टैटिक फाइल्स को सर्व करने के लिए
app.use(express.static(path.join(__dirname, '/')));

// Gemini API Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Agentic AI Route
app.post('/api/agent', async (req, res) => {
    try {
        const { prompt, agentType } = req.body;
        
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ success: false, error: "API Key is missing in Render Environment Variables." });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        let systemInstruction = "";

        // Persona Logic based on module
        if (agentType === "trading") {
            systemInstruction = "You are 'Trading Sensei' for the Captain Module. Guide with SENSEX/Nifty chart analysis, risk management, and trading psychology. Be precise and tactical.";
        } else if (agentType === "bams") {
            systemInstruction = "You are 'BAMS Academic Sage' for the Iron Man Module. Explain Ayurvedic concepts (Charaka Samhita, Rachana Sharir, etc.) clearly in Hindi/English. Provide easy ways to memorize Slokas and anatomical terms.";
        } else {
            systemInstruction = "You are JARVIS, the core AI system of the KK Command Dashboard. Assist efficiently with agency tasks, code, or general queries.";
        }

        const fullPrompt = `${systemInstruction}\n\nUser Query: ${prompt}`;
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        res.json({ success: true, message: text });

    } catch (error) {
        console.error("AI Core Error:", error);
        res.status(500).json({ success: false, error: "JARVIS Core API Connection Failed." });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`JARVIS Systems Online... Server running on port ${port}`);
});

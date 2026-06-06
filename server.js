const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// UPDATE: Ab yeh line seedha aapke main folder ko access karegi
app.use(express.static(__dirname));

// Gemini AI Initialisation
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// API Endpoint for Jarvis AI Conversations
app.post('/api/agent', async (req, res) => {
    try {
        const { prompt, agentType } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ success: false, message: "Server Configuration Error: API Key missing." });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ success: true, message: text });
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ success: false, message: "Jarvis Core Error: Stream interrupted, Sir." });
    }
});

// UPDATE: Ab index.html ko direct root directory se bheja jayega
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`⚡ Command Dashboard Matrix active on port ${PORT}`);
});

const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(__dirname));

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// API Endpoint for Jarvis/Teacher AI Conversations
app.post('/api/agent', async (req, res) => {
    console.log("--> Request Received at /api/agent");
    try {
        const { prompt, agentType } = req.body;
        console.log(`--> Processing Prompt: "${prompt}" | Mode: ${agentType}`);

        if (!process.env.GEMINI_API_KEY) {
            console.error("--> ERROR: GEMINI_API_KEY is missing in environment variables.");
            return res.status(500).json({ success: false, message: "Server Error: API Key missing." });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("--> Response Generated Successfully.");
        res.json({ success: true, message: text });
    } catch (error) {
        console.error("--> GEMINI API ERROR:", error.message);
        res.status(500).json({ success: false, message: "AI Core failure. Check server logs." });
    }
});

// Serve the Main Interface
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`⚡ Command Dashboard Master Node active on port ${PORT}`);
});

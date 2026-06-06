const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/agent', async (req, res) => {
    console.log("--> Request Received at /api/agent");
    try {
        const { prompt, agentType } = req.body;
        console.log(`--> Prompt: "${prompt}" | Mode: ${agentType}`);

        if (!process.env.GEMINI_API_KEY) {
            console.error("--> ERROR: GEMINI_API_KEY missing in environment variables.");
            return res.status(500).json({ success: false, message: "API Key missing on server." });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ success: true, message: text });
    } catch (error) {
        console.error("--> GEMINI API ERROR:", error.message);
        res.status(500).json({ success: false, message: "AI Core failure. Check server logs." });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`⚡ Command Dashboard Master Node active on port ${PORT}`);
});

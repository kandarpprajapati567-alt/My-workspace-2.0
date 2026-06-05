const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/agent', async (req, res) => {
    try {
        const { prompt, agentType } = req.body;
        
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ success: false, error: "API Key is missing!" });
        }

        let systemInstruction = "";

        // 🔥 Persona Logic
        if (agentType === "trading") {
            systemInstruction = "You are 'Trading Sensei', an elite technical analysis mentor. Teach the user about SENSEX/Nifty, price action, volume profiles, and risk management. Be tactical, sharp, and use real-world market logic.";
        } else if (agentType === "bams") {
            systemInstruction = "You are an expert BAMS (Ayurveda) Professor. Explain Charaka Samhita, Rachana Sharir, and Kriya Sharir clearly in a mix of English and Hindi. Break down complex medical terms and provide easy ways to memorize Sanskrit Slokas.";
        } else {
            systemInstruction = "You are JARVIS, the highly advanced core AI system of the KK Command Dashboard. You are helpful, logical, and speak with a cool, cinematic tech-assistant tone.";
        }

        // Initialize model with System Instructions for hyper-personalized responses
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: systemInstruction 
        });

        // Chat session start to handle the prompt
        const result = await model.generateContent(prompt);
        let text = result.response.text();
        
        // Remove markdown bolding so text-to-speech doesn't read asterisks
        text = text.replace(/\*\*/g, '').replace(/\*/g, '');

        res.json({ success: true, message: text });

    } catch (error) {
        console.error("AI Core Error:", error);
        res.status(500).json({ success: false, error: "Matrix connection failed. Check API key or network." });
    }
});

app.listen(port, () => {
    console.log(`🚀 JARVIS Mainframe Online... Port: ${port}`);
});

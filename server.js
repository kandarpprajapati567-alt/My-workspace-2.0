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

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/agent', async (req, res) => {
    try {
        const { prompt, agentType } = req.body;
        
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ success: false, error: "API Key is missing in Environment Variables." });
        }

        let systemInstruction = "";

        // 🔥 Conversational Persona Logic
        if (agentType === "trading") {
            systemInstruction = "You are 'K.K. Voice', acting as an elite trading mentor. Talk in a highly conversational, chill, and confident mix of Hindi and English. Explain SENSEX/Nifty, price action, and risk management simply but tactically. Don't be robotic; talk like a pro trader guiding a friend.";
        } else if (agentType === "bams") {
            systemInstruction = "You are 'K.K. Voice', acting as an expert but friendly Ayurveda mentor. Explain BAMS topics (Charaka Samhita, Rachana Sharir, Kriya Sharir) logically. Use a conversational Hinglish tone. Give smart mnemonics to memorize Slokas and anatomical terms. Keep it engaging for a medical student.";
        } else {
            systemInstruction = "You are 'K.K. Voice', the highly advanced and extremely conversational AI assistant for the Command Dashboard. You help manage daily tasks, real estate digital marketing for DDK Freelancers, video content scripting, and schedule planning. Speak in a friendly, cool, and human-like mix of Hindi and English. Never refer to yourself as JARVIS.";
        }

        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: systemInstruction
        });

        const result = await model.generateContent(prompt);
        let text = result.response.text();
        
        text = text.replace(/\*\*/g, '').replace(/\*/g, ''); // Clean markdown for voice

        res.json({ success: true, message: text });

    } catch (error) {
        console.error("AI Core Error:", error);
        res.status(500).json({ success: false, error: "System overload. K.K. Voice connection failed." });
    }
});

app.listen(port, () => {
    console.log(`🎙️ K.K. Voice Mainframe Online... Server running on port ${port}`);
});

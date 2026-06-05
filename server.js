// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables (.env file se API key uthayega)
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Frontend files (index.html, etc.) ko serve karne ke liye
app.use(express.static(path.join(__dirname, 'public')));

// Gemini API ka secure endpoint
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: "Gemini API Key missing on server!" });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    // Jarvis ka System Prompt (Personality)
    const contextPrompt = `You are JARVIS, K.K.'s highly advanced, cinematic personal AI assistant. 
    You manage his BAMS studies (Samhita, Rachana Sharir, Kriya Sharir, etc.), Exam Vault, and Shloka Library.
    Respond strictly in a smart, high-tech, Tony Stark AI style. Keep answers concise, direct, and slightly robotic but loyal.
    User says: ${userMessage}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: contextPrompt }] }]
            })
        });

        const data = await response.json();
        const aiResponseText = data.candidates[0].content.parts[0].text;
        
        res.json({ reply: aiResponseText });
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ reply: "Sir, I am unable to connect to the main brain network at this moment." });
    }
});

// Render.com assigns a dynamic PORT, locally it uses 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`JARVIS Server is online on port ${PORT}`);
});

const express = require("express");
const router = express.Router();
const axios = require("axios");
const authMiddleware = require("../middleware/auth");

router.post("/enhance", authMiddleware, async (req, res) => {
  const { text, type } = req.body;

  if (!text) return res.status(400).json({ error: "No text provided" });

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a Senior Hiring Manager. 
            Rewrite the user's input to be professional, impactful, and clear.
            
            STRICT RULES:
            1. DO NOT use "AI-cliché" words: Spearheaded, leveraged, tapestry, passionate, synergy, meticulously, driven, or transformative.
            2. USE "Action-Result" language: Use simple verbs like Led, Developed, Built, Managed, Increased, Saved, or Created.
            3. BE CONCISE: Avoid fluff. If a sentence doesn't add a fact or a number, remove it.
            4. SOUND HUMAN: Write like a person describing their work to a colleague.
            5. Return ONLY the rewritten text without quotes or intros.`,
          },
          {
            role: "user",
            content: `Rewrite this resume ${type} to sound more authentic and professional: "${text}"`,
          },
        ],
        temperature: 0.6, // Lower temperature makes the AI less "creative" and more factual
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const enhancedText = response.data.choices[0].message.content.trim();
    res.json({ enhancedText });
  } catch (err) {
    console.error(
      "Groq Error:",
      err.response ? err.response.data : err.message,
    );
    res.status(500).json({ error: "AI Enhancement failed" });
  }
});

module.exports = router;

import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/feedback
router.post('/', async (req, res) => {
  try {
    const { audioBase64 } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: 'No audio data received' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You are a karaoke singing judge. Evaluate the singing in this audio and return JSON like:

{
  "feedback": "Your pitch was great! Try to improve your timing.",
  "score": 0-100
}

Focus on pitch, clarity, and rhythm.
`;

    const result = await model.generateContent([
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "audio/webm", // adjust if your input is audio/wav
              data: audioBase64
            }
          }
        ]
      }
    ]);

    const response = await result.response;
    const text = await response.text();

    // Robust JSON extraction
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) {
      throw new Error("Could not extract JSON from Gemini response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.feedback || parsed.score === undefined) {
      throw new Error("Incomplete feedback or score");
    }

    res.json(parsed);

  } catch (err) {
    console.error("Gemini feedback error:", err.message);
    res.status(500).json({ error: "Gemini analysis failed", detail: err.message });
  }
});

export default router;

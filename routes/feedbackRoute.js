import express from 'express';
import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Save base64 audio to uploads
function saveBase64ToFile(base64, filepath) {
  const uploadsDir = path.dirname(filepath);
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const buffer = Buffer.from(base64, 'base64');
  fs.writeFileSync(filepath, buffer);
}

// Generate full audio URL
function getAudioUrl(filePath, req) {
  return `${req.protocol}://${req.get('host')}/uploads/${path.basename(filePath)}`;
}

// POST /api/feedback
router.post('/', async (req, res) => {
  try {
    const {
      audioBase64,
      originalLyrics = '',
      transcribedLyrics = '',
    } = req.body;

    if (!audioBase64) return res.status(400).json({ error: 'No audio provided' });

    const fileName = `user-recording-${Date.now()}.webm`;
    const filePath = path.join('uploads', fileName);
    saveBase64ToFile(audioBase64, filePath);
    const audioUrl = getAudioUrl(filePath, req);

// ChatGPT prompt
    const prompt = `You are a karaoke singing judge AI. Given the user's transcribed lyrics and the original lyrics, provide:
1. Constructive feedback on singing technique, pitch, timing, and emotion.
2. A score from 0 to 100 (higher is better).

Reply ONLY in JSON format:
{
  "feedback": "...",
  "score": 85,
  "analysis": {
    "strengths": "...",
    "improvements": "..."
  }
}

Transcribed Lyrics:
${transcribedLyrics}

Original Lyrics:
${originalLyrics}
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const text = response.choices[0]?.message?.content || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    let parsed = {};
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.warn('❌ Failed to parse JSON from GPT:', e.message);
      }
    }
    const {
      feedback = 'No feedback generated.',
      score = 0,
      analysis = {},
    } = parsed;

    res.json({
      message: 'Recording uploaded successfully',
      fileUrl: `/uploads/${fileName}`,
      audioUrl,
      transcribedLyrics,
      score,
      feedback,
      analysis,
    });
  } catch (err) {
    console.error('❌ Feedback Error:', err);
    res.status(500).json({
      message: 'Recording uploaded successfully',
      fileUrl: `/uploads/${Date.now()}.webm`,
      feedback:
        "I'm sorry, I couldn't process your performance. Please try again or provide valid lyrics.",
      score: 0,
      analysis: {},
      error: err.message,
    });
  }
});

export default router;
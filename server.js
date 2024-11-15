import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import { createServer } from 'vite';

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: "xai-lQ8XGt23z2lXYTxgPSH6LjGeDpiZmaoAaSX4iBAyKz1pEzT4stJTYa9EBZTT8wnXbeiX26NsJ5sEajQj",
  baseURL: "https://api.x.ai/v1",
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const completion = await openai.chat.completions.create({
      model: "grok-beta",
      messages,
    });
    res.json(completion.choices[0].message);
  } catch (error) {
    console.error('XAI API Error:', error);
    res.status(500).json({ error: 'Failed to get response from XAI' });
  }
});

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'spa',
});

app.use(vite.middlewares);

const port = 5173;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
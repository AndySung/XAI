import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messages } = JSON.parse(event.body);
    const completion = await openai.chat.completions.create({
      model: "grok-beta",
      messages,
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(completion.choices[0].message),
    };
  } catch (error) {
    console.error('XAI API Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get response from XAI' }),
    };
  }
};
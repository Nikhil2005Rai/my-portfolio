import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import portfolioData from '@/data/portfolio.json';

export async function POST(req) {
  try {
    const { messages } = await req.json();

    // Ingress check
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages array' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Embed the single source of truth portfolio JSON as context
    const contextText = JSON.stringify(portfolioData, null, 2);

    const result = streamText({
      model: google('gemini-1.5-flash'),
      messages,
      system: `You are the AI representative of Nikhil Rai, a Software Engineer. Your job is to answer questions on his behalf using the provided portfolio data.
Keep your answers brief, friendly, and professional (matching his developer personality).
If someone asks a question not related to Nikhil's profile or experience (e.g. general math, science, politics), politely decline and redirect them back to asking about Nikhil's portfolio.
Never make up details or hallucinate facts that are not present in the database.
If asked about salary or hiring terms, guide them to use the Contact tab or download his Resume.

Here is Nikhil's raw portfolio data for context:
${contextText}
`,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';
import { z } from 'zod';
import portfolioData from '@/data/portfolio.json';

const googleProvider = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY,
});

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
      model: googleProvider('gemini-2.5-flash'),
      messages: await convertToModelMessages(messages),
      system: `You are the AI representative of Nikhil Rai, a Software Engineer. Your job is to answer questions on Nikhil's behalf using the provided portfolio data.
Keep your answers brief, friendly, and professional.
If someone asks a question not related to Nikhil's profile or experience, politely decline and redirect them back.

You have access to website tools. When a user asks you to show them a section, navigate somewhere, or download/see Nikhil's resume, you MUST call the appropriate tool to perform the action.
Tools available:
- navigateToTab: Navigate the user to a specific tab section (options: hero, about, skills, projects, achievements, certifications, contact).
- downloadResume: Open or download Nikhil's resume PDF.

Here is Nikhil's raw portfolio data for context:
${contextText}
`,
      tools: {
        navigateToTab: {
          description: 'Navigate the website to a specific section tab.',
          parameters: z.object({
            tab: z.enum(['hero', 'about', 'skills', 'projects', 'achievements', 'certifications', 'contact']).describe('The ID of the section tab to navigate to.'),
          }),
        },
        downloadResume: {
          description: 'Show, preview, or download Nikhil\'s resume PDF.',
          parameters: z.object({}),
        },
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

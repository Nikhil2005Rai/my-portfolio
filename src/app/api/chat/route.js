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

    // Fetch dynamic live metrics to inject into chatbot system prompt
    const liveStats = await fetchDynamicStats();

    // Embed the single source of truth portfolio JSON as context
    const contextText = JSON.stringify(portfolioData, null, 2);

    const result = streamText({
      model: googleProvider('gemini-2.5-flash'),
      messages: await convertToModelMessages(messages),
      system: `You are the AI representative of Nikhil Rai, a Software Engineer. Your job is to answer questions on Nikhil's behalf using the provided portfolio data.
Keep your answers brief, friendly, and professional.
If someone asks a question not related to Nikhil's profile or experience, politely decline and redirect them back.

Here are Nikhil's CURRENT real-time performance statistics. Use these live numbers when answering queries about his stats, rather than any static placeholders:
- LeetCode Solved Count: ${liveStats?.leetcodeSolved || '1000+'}+ problems solved
- LeetCode Contest Rating: ${liveStats?.leetcodeRating || '2000+'}+ (placed in the top ${liveStats?.leetcodeTopPercentage || '5'}% globally, global rank: ${liveStats?.leetcodeRank || '15000'})
- GitHub Total Stars: ${liveStats?.githubStars || '5'}
- GitHub Followers: ${liveStats?.githubFollowers || '10'}
- GitHub Repositories: ${liveStats?.githubRepos || '15'}

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

// Fetch live counts with 24h caching revalidation
async function fetchDynamicStats() {
  try {
    const leetcodeUser = 'NikhilRai2005';
    const githubUser = 'Nikhil2005Rai';

    const [githubProfileRes, githubReposRes, leetcodeSolvedRes, leetcodeRankRes] = await Promise.all([
      fetch(`https://api.github.com/users/${githubUser}`, {
        next: { revalidate: 86400 },
        headers: { 'User-Agent': 'NikhilRai-Portfolio' }
      }).catch(() => null),
      fetch(`https://api.github.com/users/${githubUser}/repos?per_page=100`, {
        next: { revalidate: 86400 },
        headers: { 'User-Agent': 'NikhilRai-Portfolio' }
      }).catch(() => null),
      fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'NikhilRai-Portfolio' },
        body: JSON.stringify({
          query: `
            query userProblemsSolved($username: String!) {
              matchedUser(username: $username) {
                submitStats {
                  acSubmissionNum {
                    difficulty
                    count
                  }
                }
              }
            }
          `,
          variables: { username: leetcodeUser }
        }),
        next: { revalidate: 86400 }
      }).catch(() => null),
      fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'NikhilRai-Portfolio' },
        body: JSON.stringify({
          query: `
            query userContestRankingInfo($username: String!) {
              userContestRanking(username: $username) {
                rating
                globalRanking
                topPercentage
              }
            }
          `,
          variables: { username: leetcodeUser }
        }),
        next: { revalidate: 86400 }
      }).catch(() => null)
    ]);

    let stats = {
      githubRepos: 15,
      githubFollowers: 10,
      githubStars: 5,
      leetcodeSolved: 1000,
      leetcodeRating: 2000,
      leetcodeRank: 15000,
      leetcodeTopPercentage: 5
    };

    if (githubProfileRes && githubProfileRes.ok) {
      const data = await githubProfileRes.json();
      stats.githubRepos = data.public_repos || stats.githubRepos;
      stats.githubFollowers = data.followers || stats.githubFollowers;
    }
    if (githubReposRes && githubReposRes.ok) {
      const repos = await githubReposRes.json();
      if (Array.isArray(repos)) {
        stats.githubStars = repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
      }
    }
    if (leetcodeSolvedRes && leetcodeSolvedRes.ok) {
      const result = await leetcodeSolvedRes.json();
      const acStats = result?.data?.matchedUser?.submitStats?.acSubmissionNum;
      if (acStats && Array.isArray(acStats)) {
        const totalSolved = acStats.find(item => item.difficulty === 'All')?.count;
        if (totalSolved) stats.leetcodeSolved = totalSolved;
      }
    }
    if (leetcodeRankRes && leetcodeRankRes.ok) {
      const result = await leetcodeRankRes.json();
      const ranking = result?.data?.userContestRanking;
      if (ranking) {
        stats.leetcodeRating = Math.round(ranking.rating) || stats.leetcodeRating;
        stats.leetcodeRank = ranking.globalRanking || stats.leetcodeRank;
        stats.leetcodeTopPercentage = ranking.topPercentage || stats.leetcodeTopPercentage;
      }
    }
    return stats;
  } catch (error) {
    console.error('Error fetching dynamic stats for chat:', error);
    return null;
  }
}

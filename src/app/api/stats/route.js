import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const leetcodeUser = 'NikhilRai2005';
    const githubUser = 'Nikhil2005Rai';

    // Fetch GitHub and LeetCode data in parallel with 24-hour cache revalidation (SWR)
    const [githubProfileRes, githubReposRes, leetcodeSolvedRes, leetcodeRankRes] = await Promise.all([
      // 1. GitHub Profile
      fetch(`https://api.github.com/users/${githubUser}`, {
        next: { revalidate: 86400 },
        headers: { 'User-Agent': 'NikhilRai-Portfolio' }
      }).catch(err => { console.error('GitHub Profile Fetch Failed:', err); return null; }),

      // 2. GitHub Repos (for star counts)
      fetch(`https://api.github.com/users/${githubUser}/repos?per_page=100`, {
        next: { revalidate: 86400 },
        headers: { 'User-Agent': 'NikhilRai-Portfolio' }
      }).catch(err => { console.error('GitHub Repos Fetch Failed:', err); return null; }),

      // 3. LeetCode Solved Count
      fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'NikhilRai-Portfolio' },
        body: JSON.stringify({
          query: `
            query userProblemsSolved($username: String!) {
              allQuestionsCount {
                difficulty
                count
              }
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
      }).catch(err => { console.error('LeetCode Solved Fetch Failed:', err); return null; }),

      // 4. LeetCode Contest Ranking
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
      }).catch(err => { console.error('LeetCode Rank Fetch Failed:', err); return null; })
    ]);

    // Parse GitHub Stats
    let githubStats = {
      repos: 15,
      followers: 10,
      stars: 5
    };

    if (githubProfileRes && githubProfileRes.ok) {
      const data = await githubProfileRes.json();
      githubStats.repos = data.public_repos || githubStats.repos;
      githubStats.followers = data.followers || githubStats.followers;
    }

    if (githubReposRes && githubReposRes.ok) {
      const repos = await githubReposRes.json();
      if (Array.isArray(repos)) {
        githubStats.stars = repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
      }
    }

    // Parse LeetCode Stats
    let leetcodeStats = {
      solved: 1000,
      rating: 2000,
      globalRank: 15000,
      topPercentage: 5
    };

    if (leetcodeSolvedRes && leetcodeSolvedRes.ok) {
      const result = await leetcodeSolvedRes.json();
      const acStats = result?.data?.matchedUser?.submitStats?.acSubmissionNum;
      if (acStats && Array.isArray(acStats)) {
        const totalSolved = acStats.find(item => item.difficulty === 'All')?.count;
        if (totalSolved) leetcodeStats.solved = totalSolved;
      }
    }

    if (leetcodeRankRes && leetcodeRankRes.ok) {
      const result = await leetcodeRankRes.json();
      const ranking = result?.data?.userContestRanking;
      if (ranking) {
        leetcodeStats.rating = Math.round(ranking.rating) || leetcodeStats.rating;
        leetcodeStats.globalRank = ranking.globalRanking || leetcodeStats.globalRank;
        leetcodeStats.topPercentage = ranking.topPercentage || leetcodeStats.topPercentage;
      }
    }

    return NextResponse.json({
      success: true,
      github: githubStats,
      leetcode: leetcodeStats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Stats endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch dynamic stats',
      fallback: true
    }, { status: 500 });
  }
}

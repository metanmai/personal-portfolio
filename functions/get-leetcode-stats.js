exports.handler = async (event) => {
    if (event.httpMethod && event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'METHOD NOT ALLOWED' })
        };
    }

    const username = process.env.LEETCODE_USERNAME || 'metanmai';

    const query = 'query userProblemsSolved($username: String!) { matchedUser(username: $username) { submitStatsGlobal { acSubmissionNum { difficulty count } } profile { ranking } } }';

    try {
        const response = await fetch('https://leetcode.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Referer': 'https://leetcode.com'
            },
            body: JSON.stringify({
                query,
                variables: { username }
            })
        });

        if (!response.ok) {
            return {
                statusCode: 502,
                body: JSON.stringify({ error: 'UPSTREAM FAILURE' })
            };
        }

        const json = await response.json();
        const matched = json && json.data && json.data.matchedUser;

        if (!matched) {
            return {
                statusCode: 502,
                body: JSON.stringify({ error: 'UPSTREAM FAILURE' })
            };
        }

        const acRows = (matched.submitStatsGlobal && Array.isArray(matched.submitStatsGlobal.acSubmissionNum))
            ? matched.submitStatsGlobal.acSubmissionNum
            : [];

        const findCount = (difficulty) => {
            const row = acRows.find((entry) => entry && entry.difficulty === difficulty);
            return row && typeof row.count === 'number' ? row.count : 0;
        };

        const solved = {
            easy: findCount('Easy'),
            medium: findCount('Medium'),
            hard: findCount('Hard'),
            total: findCount('All')
        };

        const ranking = (matched.profile && typeof matched.profile.ranking === 'number')
            ? matched.profile.ranking
            : null;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=3600'
            },
            body: JSON.stringify({ solved, ranking })
        };
    } catch (error) {
        console.error('get-leetcode-stats failed:', error);
        return {
            statusCode: 502,
            body: JSON.stringify({ error: 'UPSTREAM FAILURE' })
        };
    }
};

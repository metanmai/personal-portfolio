exports.handler = async (event) => {
  if (event.httpMethod && event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'METHOD NOT ALLOWED' })
    };
  }

  const apiKey = process.env.STEAM_API_KEY;
  const steamId = process.env.STEAM_ID64;

  if (!apiKey || !steamId) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'NOT CONFIGURED' })
    };
  }

  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${encodeURIComponent(apiKey)}&steamid=${encodeURIComponent(steamId)}&include_appinfo=true&include_played_free_games=true&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return {
        statusCode: 502,
        body: JSON.stringify({ error: 'UPSTREAM FAILURE' })
      };
    }

    const json = await response.json();
    const rawGames = json && json.response && Array.isArray(json.response.games) ?
      json.response.games :
      [];

    const games = rawGames
      .sort((a, b) => (b.playtime_forever || 0) - (a.playtime_forever || 0))
      .slice(0, 10)
      .map((game) => ({
        name: game.name || '',
        appid: game.appid,
        hours2w: Math.round((game.playtime_2weeks || 0) / 60 * 10) / 10,
        hoursTotal: Math.round((game.playtime_forever || 0) / 60 * 10) / 10,
        header: `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`
      }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=600'
      },
      body: JSON.stringify({ games })
    };
  } catch (error) {
    console.error('get-steam-games failed:', error);
    return {
      statusCode: 502,
      body: JSON.stringify({ error: 'UPSTREAM FAILURE' })
    };
  }
};

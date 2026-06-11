exports.handler = async (event) => {
  if (event.httpMethod && event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'METHOD NOT ALLOWED' })
    };
  }

  const apiKey = "****************0027";
  const username = "****************nmai";

  if (!apiKey || !username) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'NOT CONFIGURED' })
    };
  }

  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(username)}&api_key=${encodeURIComponent(apiKey)}&format=json&limit=10`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return {
        statusCode: 502,
        body: JSON.stringify({ error: 'UPSTREAM FAILURE' })
      };
    }

    const json = await response.json();
    const rawTracks = json && json.recenttracks && Array.isArray(json.recenttracks.track) ?
    json.recenttracks.track :
    [];

    const tracks = rawTracks.map((track) => {
      const images = Array.isArray(track.image) ? track.image : [];
      const large = images.find((img) => img.size === 'large');
      const chosen = large || images[images.length - 1] || {};
      return {
        name: track.name || '',
        artist: track.artist && track.artist['#text'] || '',
        album: track.album && track.album['#text'] || '',
        art: chosen['#text'] || '',
        nowPlaying: track['@attr'] && track['@attr'].nowplaying === 'true',
        playedAt: track.date && Number(track.date.uts) || null
      };
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      },
      body: JSON.stringify({ tracks })
    };
  } catch (error) {
    console.error('get-recent-tracks failed:', error);
    return {
      statusCode: 502,
      body: JSON.stringify({ error: 'UPSTREAM FAILURE' })
    };
  }
};
// Last.fm "tops" endpoint for the AUDIO LOG.
//   ?type=artists|albums  &period=week|month|year
// Returns the deduped top 10 artists, or the deduped top 10 albums plus a set
// of genres aggregated from those albums' Last.fm tags.

const PERIOD_MAP = { week: '7day', month: '1month', year: '12month' };

// Last.fm tags are user-generated and noisy; drop obvious non-genres.
const TAG_JUNK = new Set([
    'SEEN LIVE', 'FAVORITES', 'FAVOURITES', 'FAVORITE', 'ALBUMS I OWN', 'VINYL',
    'SPOTIFY', 'MUSIC', 'BEAUTIFUL', 'LOVE', 'AWESOME', 'MALE VOCALISTS',
    'FEMALE VOCALISTS', 'MY MUSIC', 'OWNED',
]);

const API = 'https://ws.audioscrobbler.com/2.0/';

const pickImage = (images) => {
    if (!Array.isArray(images)) return '';
    const bySize = (s) => images.find((i) => i && i.size === s);
    const chosen = bySize('extralarge') || bySize('large') || images[images.length - 1] || {};
    return chosen['#text'] || '';
};

const asArray = (v) => (Array.isArray(v) ? v : (v ? [v] : []));

// Last.fm doesn't serve artist images; Deezer's keyless search returns 1000px
// photos. Best-effort — returns '' on any failure so the list still renders.
const deezerArtistImage = async (name) => {
    try {
        const r = await fetch(`https://api.deezer.com/search/artist?limit=1&q=${encodeURIComponent(name)}`);
        if (!r.ok) return '';
        const j = await r.json();
        const hit = (j && Array.isArray(j.data) && j.data[0]) ? j.data[0] : null;
        return hit ? (hit.picture_xl || hit.picture_big || hit.picture_medium || '') : '';
    } catch {
        return '';
    }
};

exports.handler = async (event) => {
    if (event.httpMethod && event.httpMethod !== 'GET') {
        return { statusCode: 405, body: JSON.stringify({ error: 'METHOD NOT ALLOWED' }) };
    }

    const apiKey = process.env.LASTFM_API_KEY;
    const username = process.env.LASTFM_USERNAME;
    if (!apiKey || !username) {
        return { statusCode: 500, body: JSON.stringify({ error: 'NOT CONFIGURED' }) };
    }

    const params = event.queryStringParameters || {};
    const type = params.type === 'albums' ? 'albums' : 'artists';
    const period = PERIOD_MAP[params.period] || '7day';
    const key = encodeURIComponent(apiKey);
    const user = encodeURIComponent(username);

    const ok = (body) => ({
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' },
        body: JSON.stringify(body),
    });

    try {
        if (type === 'artists') {
            const res = await fetch(`${API}?method=user.gettopartists&user=${user}&api_key=${key}&period=${period}&limit=10&format=json`);
            if (!res.ok) return { statusCode: 502, body: JSON.stringify({ error: 'UPSTREAM FAILURE' }) };
            const json = await res.json();
            const raw = asArray(json && json.topartists && json.topartists.artist);

            const seen = new Set();
            const artists = [];
            raw.forEach((a) => {
                const name = (a && a.name) || '';
                const dedupeKey = name.toLowerCase();
                if (!name || seen.has(dedupeKey)) return;
                seen.add(dedupeKey);
                artists.push({
                    name,
                    playcount: Number(a.playcount) || 0,
                    url: a.url || '',
                });
            });
            const top = artists.slice(0, 10);
            // enrich with high-res photos (parallel, best-effort)
            await Promise.all(top.map(async (a) => { a.image = await deezerArtistImage(a.name); }));
            return ok({ artists: top });
        }

        // type === 'albums'
        const res = await fetch(`${API}?method=user.gettopalbums&user=${user}&api_key=${key}&period=${period}&limit=10&format=json`);
        if (!res.ok) return { statusCode: 502, body: JSON.stringify({ error: 'UPSTREAM FAILURE' }) };
        const json = await res.json();
        const raw = asArray(json && json.topalbums && json.topalbums.album);

        const seen = new Set();
        const albums = [];
        raw.forEach((al) => {
            const name = (al && al.name) || '';
            const artist = (al && al.artist && al.artist.name) || '';
            const dedupeKey = `${artist.toLowerCase()}::${name.toLowerCase()}`;
            if (!name || seen.has(dedupeKey)) return;
            seen.add(dedupeKey);
            albums.push({
                name,
                artist,
                playcount: Number(al.playcount) || 0,
                art: pickImage(al.image),
                url: al.url || '',
            });
        });
        const top = albums.slice(0, 10);

        // Aggregate genres from the top albums' tags (best-effort).
        const counts = {};
        const infos = await Promise.all(top.slice(0, 6).map((a) => fetch(
            `${API}?method=album.getinfo&artist=${encodeURIComponent(a.artist)}&album=${encodeURIComponent(a.name)}&api_key=${key}&format=json`,
        ).then((r) => (r.ok ? r.json() : null)).catch(() => null)));

        infos.forEach((info) => {
            const tags = asArray(info && info.album && info.album.tags && info.album.tags.tag);
            tags.forEach((t) => {
                const name = ((t && t.name) || '').trim().toUpperCase();
                if (!name || TAG_JUNK.has(name) || /^\d{4}$/.test(name)) return;
                counts[name] = (counts[name] || 0) + 1;
            });
        });
        const genres = Object.keys(counts)
            .sort((a, b) => counts[b] - counts[a])
            .slice(0, 6);

        return ok({ albums: top, genres });
    } catch (error) {
        console.error('get-lastfm-tops failed:', error);
        return { statusCode: 502, body: JSON.stringify({ error: 'UPSTREAM FAILURE' }) };
    }
};

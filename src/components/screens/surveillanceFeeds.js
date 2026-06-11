import { monitor } from '../../constants/index.js';
import { prefetchRemoteData } from '../../hooks/useRemoteData.js';

// Every feed the SUBJECT SURVEILLANCE screen reads, with the defaults its
// panels open on (period = week). These must mirror the URLs requested inside
// SystemMonitor so the prefetch warms the same cache keys.
export const SURVEILLANCE_FEEDS = [
    `https://api.github.com/users/${monitor.githubUser}`,
    `https://api.github.com/users/${monitor.githubUser}/repos?per_page=100&sort=updated`,
    `https://github-contributions-api.jogruber.de/v4/${monitor.githubUser}?y=last`,
    '/.netlify/functions/get-leetcode-stats',
    '/.netlify/functions/get-steam-games?type=recent',
    '/.netlify/functions/get-steam-games?type=most',
    '/.netlify/functions/get-recent-tracks',
    '/.netlify/functions/get-lastfm-tops?type=artists&period=week',
    '/.netlify/functions/get-lastfm-tops?type=albums&period=week',
];

// Call once at app start so the boot sequence warms the cache and the page
// paints with data instead of spinners.
export const prefetchSurveillance = () => SURVEILLANCE_FEEDS.forEach(prefetchRemoteData);

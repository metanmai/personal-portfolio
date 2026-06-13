import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { createRequire } from 'node:module';

import { existsSync } from 'node:fs';

// Vite loads dotenv for client code but not for the dev server's Node process.
// Functions proxied by netlify-functions-dev read process.env, so we need to
// explicitly load .env so STEAM_API_KEY etc. are visible during local dev.
// On Netlify, env vars come from the dashboard and .env doesn't exist.
const envFile = resolve(process.cwd(), '.env');
if (existsSync(envFile)) process.loadEnvFile(envFile);

// During `vite dev` there is no Netlify runtime, so requests to
// /.netlify/functions/<name> 404 — which is why the LeetCode card shows
// "SIGNAL LOST" locally while the GitHub card (a direct browser fetch to
// api.github.com) works. This plugin mounts the same handlers in the dev
// server so the endpoints behave like they do on Netlify.
//
// NOTE: vite.config.js changes do NOT hot-reload — restart `npm run dev`
// after editing this file for the plugin to take effect.
//
// The functions are authored as CommonJS (`exports.handler = ...`). They use
// `.cjs` extensions because the enclosing package.json has "type": "module" —
const loadFunctionHandler = (name) => {
    let file = resolve(process.cwd(), 'functions', `${name}.cjs`);
    try { readFileSync(file, 'utf8'); } catch { file = resolve(process.cwd(), 'functions', `${name}.js`); }
    const code = readFileSync(file, 'utf8');
    const mod = { exports: {} };
    const req = createRequire(file);
    // eslint-disable-next-line no-new-func
    const wrap = new Function('module', 'exports', 'require', '__filename', '__dirname', code);
    wrap(mod, mod.exports, req, file, dirname(file));
    return mod.exports.handler || (mod.exports.default && mod.exports.default.handler);
};

const netlifyFunctionsDev = () => ({
    name: 'netlify-functions-dev',
    apply: 'serve',
    configureServer(server) {
        const PREFIX = '/.netlify/functions/';
        server.middlewares.use(async (req, res, next) => {
            if (!req.url || !req.url.startsWith(PREFIX)) {
                next();
                return;
            }

            const [path, search = ''] = req.url.slice(PREFIX.length).split('?');
            const name = path.replace(/[^a-zA-Z0-9_-]/g, '');
            const params = Object.fromEntries(new URLSearchParams(search));

            try {
                const handler = loadFunctionHandler(name);
                if (typeof handler !== 'function') {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'FUNCTION NOT FOUND' }));
                    return;
                }

                const event = {
                    httpMethod: req.method,
                    headers: req.headers,
                    queryStringParameters: params,
                    path: req.url,
                };

                const result = await handler(event, {});
                res.statusCode = (result && result.statusCode) || 200;
                const headers = (result && result.headers) || { 'Content-Type': 'application/json' };
                Object.entries(headers).forEach(([key, val]) => res.setHeader(key, val));
                res.end((result && result.body) || '');
            } catch (error) {
                // Surface the real cause in the dev terminal (e.g. an upstream
                // LeetCode block) instead of a silent "SIGNAL LOST".
                // eslint-disable-next-line no-console
                console.error(`[netlify-functions-dev] ${name} failed:`, error);
                res.statusCode = 502;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'DEV FUNCTION FAILED', detail: String(error && error.message) }));
            }
        });
    },
});

export default defineConfig({
    plugins: [react(), netlifyFunctionsDev()],
    test: {
        environment: 'happy-dom',
        globals: true,
        setupFiles: './src/test/setup.js',
    },
});

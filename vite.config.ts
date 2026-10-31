import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables for local Vite development
dotenv.config();

/**
 * Dev server middleware that handles /.netlify/functions/analyze
 * during local `npm run dev`, so developers don't even need Netlify CLI installed.
 */
function netlifyLocalDevPlugin(): Plugin {
  return {
    name: 'netlify-local-dev-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/.netlify/functions/analyze' && req.method === 'POST') {
          try {
            // Buffer the request body
            const chunks: Uint8Array[] = [];
            req.on('data', (chunk) => chunks.push(chunk));
            req.on('end', async () => {
              try {
                const bodyStr = Buffer.concat(chunks).toString('utf-8');

                // Dynamically import the handler
                const { handler } = await server.ssrLoadModule('/netlify/functions/analyze.ts');

                const event = {
                  httpMethod: 'POST',
                  headers: req.headers as Record<string, string>,
                  body: bodyStr,
                  queryStringParameters: {},
                  isBase64Encoded: false,
                  rawUrl: req.url,
                  rawQuery: '',
                  path: req.url,
                };

                const context = {} as any;
                const result = await handler(event, context);

                if (result) {
                  res.statusCode = result.statusCode || 200;
                  if (result.headers) {
                    for (const [key, value] of Object.entries(result.headers)) {
                      res.setHeader(key, value as string);
                    }
                  }
                  res.end(result.body || '');
                } else {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Function returned no response' }));
                }
              } catch (err: any) {
                console.error('Local function proxy error:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message || 'Server error' }));
              }
            });
          } catch (err) {
            next(err);
          }
        } else if (req.url === '/.netlify/functions/analyze' && req.method === 'OPTIONS') {
          res.statusCode = 200;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
          res.end('');
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), netlifyLocalDevPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
  },
});


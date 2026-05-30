import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'api-dev-server',
        configureServer(server) {
          server.middlewares.use('/api/generate', async (req, res) => {
            try {
              const chunks: Buffer[] = [];
              for await (const chunk of req) chunks.push(chunk as Buffer);
              const body = Buffer.concat(chunks).toString();

              const request = new Request('http://localhost/api/generate', {
                method: req.method ?? 'POST',
                headers: { 'content-type': 'application/json' },
                body,
              });

              process.env.ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY;

              const mod = await server.ssrLoadModule('/api/generate.ts');
              const response = await (mod.default as (r: Request) => Promise<Response>)(request);

              const contentType = response.headers.get('Content-Type') ?? 'text/plain';
              res.writeHead(response.status, { 'Content-Type': contentType });
              if (response.body) {
                const reader = response.body.getReader();
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  res.write(value);
                }
                res.end();
              } else {
                res.end();
              }
            } catch {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Dev server error', code: 'api' }));
            }
          });
        },
      },
    ],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: (content: string, filepath: string) => {
            if (filepath.includes('_variables') || filepath.includes('_mixins')) {
              return content;
            }
            return `@use '@/styles/_variables.scss' as *;\n@use '@/styles/_mixins.scss' as *;\n${content}`;
          },
        },
      },
    },
  };
});

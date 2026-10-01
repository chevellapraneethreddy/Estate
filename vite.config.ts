import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'save-model-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.method === 'POST' && req.url?.startsWith('/api/save-model')) {
            const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
            const filename = urlObj.searchParams.get('filename');
            if (!filename) {
              res.statusCode = 400;
              res.end('Missing filename');
              return;
            }

            const dirPath = path.resolve(__dirname, 'public/models');
            if (!fs.existsSync(dirPath)) {
              fs.mkdirSync(dirPath, { recursive: true });
            }

            const filePath = path.join(dirPath, filename);
            const fileStream = fs.createWriteStream(filePath);

            req.pipe(fileStream);

            req.on('end', () => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(JSON.stringify({ success: true, url: `/models/${filename}` }));
            });

            req.on('error', (err) => {
              res.statusCode = 500;
              res.end(err.message);
            });
            return;
          }
          next();
        });
      }
    }
  ],
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [path.resolve(__dirname, 'node_modules/@playcanvas/pcui/dist')]
      }
    }
  },
  server: {
    cors: true,
    proxy: {
      '/api/generate-3d': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/generated': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})

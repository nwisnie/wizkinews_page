import { defineConfig } from 'vite';

function setIsolationHeaders({ middlewares }) {
  // Run before Vite's static handler, which can return a 304 before setting headers.
  middlewares.use((_request, response, next) => {
    response.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    response.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
  });
}

export default defineConfig({
  // Custom domains are served from the root path.
  base: '/',
  plugins: [{
    name: 'godot-cross-origin-isolation',
    configureServer: setIsolationHeaders,
    configurePreviewServer: setIsolationHeaders,
  }],
  server: {
    // Use an explicit loopback address so the browser and Vite use the same interface.
    host: '127.0.0.1',
    // Polling also detects edits on Windows/OneDrive mounts when running in WSL.
    watch: { usePolling: true, interval: 300 },
  },
});

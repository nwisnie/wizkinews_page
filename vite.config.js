import { defineConfig } from 'vite';

export default defineConfig({
  // Custom domains are served from the root path.
  base: '/',
  // Polling also detects edits on Windows/OneDrive mounts when running in WSL.
  server: { watch: { usePolling: true, interval: 300 } },
});

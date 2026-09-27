import { defineConfig } from 'vite';

export default defineConfig({
  // Polling also detects edits on Windows/OneDrive mounts when running in WSL.
  server: { watch: { usePolling: true, interval: 300 } },
});

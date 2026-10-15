import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

// heart lock: seals hearts.private.json into public/data/hearts.json when it changed, so switching
// "enabled" in that file is enough. On github the private file does not exist and this does nothing.
function sealHearts() {
  const seal = () => {
    try {
      execFileSync(process.execPath, ['scripts/seal-hearts.mjs', '--if-present', '--if-changed'], { stdio: 'inherit' });
    } catch (error) {
      console.error('heart lock: sealing failed', error.message);
    }
  };
  return {
    name: 'seal-hearts',
    buildStart: seal,
    configureServer(server) {
      const file = path.resolve('hearts.private.json');
      server.watcher.add(file);
      server.watcher.on('change', changed => {
        if (path.resolve(changed) !== file) return;
        seal();
        server.ws.send({ type: 'full-reload' });
      });
    }
  };
}

export default defineConfig({
  plugins: [vue(), sealHearts()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    postcss: {
      plugins: [
        require('tailwindcss')(),
        require('autoprefixer')(),
      ]
    }
  },
  output: {
    publicPath: './'
  }
});
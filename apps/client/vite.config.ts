import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

const strIncludes = (str: string, arr: string[]) => {
  return arr.some((item) => str.includes(item));
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin(), visualizer()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  server: {
    port: 8080,
    proxy: {
      '/api': { target: 'http://localhost:3000' },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (strIncludes(id, ['react-hook-form', '@hookform', 'zod']))
            return '@forms';

          if (strIncludes(id, ['lucide-react'])) return '@icons';

          if (strIncludes(id, ['tailwind', 'clsx', 'class-variance-authority']))
            return '@tailwindcss';

          if (strIncludes(id, ['@radix-ui'])) return '@radix-ui';

          if (strIncludes(id, ['unstyled-table'])) return '@unstyled-table';

          if (strIncludes(id, ['@tanstack'])) return '@tanstack';

          if (strIncludes(id, ['react-router', '@remix-run']))
            return '@react-router';
        },
      },
    },
  },
});

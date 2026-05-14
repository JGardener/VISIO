import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
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
});

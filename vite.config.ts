import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';
import strip from '@rollup/plugin-strip';

const root = resolve(__dirname, 'src');
const dist = resolve(__dirname, 'dist_menu');

export default defineConfig({
  root: root,
  plugins: [
    react(),
    tsconfigPaths(),
    strip({
      include: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
      exclude: [resolve(root, 'Menu', 'AppScript', '*')],
      functions: ['console.log', 'console.table', 'console.error'], // console.warnは含めたい気持ち
    }),
    viteSingleFile(),
  ],
  build: {
    outDir: dist,
    rollupOptions: {
      input: {
        menu: resolve(root, 'Menu', 'menu.html'),
      },
    },
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist/embed',
    emptyOutDir: false,
    target: 'es2017',
    sourcemap: false,
    minify: 'esbuild',
    lib: {
      entry: path.resolve(__dirname, 'src/embed.tsx'),
      name: 'SelNexaEmbed',
      formats: ['iife'],
      fileName: () => 'selnexa-embed.js',
    },
    rollupOptions: {
      output: {
        // Ensure CSS is extracted into a predictable filename
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) return 'selnexa-embed.css';
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  // Note: do not override PostCSS here to avoid interfering with the main app's setup.
  // The embed entry imports `src/index.css` so Tailwind will be processed using the project's PostCSS setup.
  // Provide minimal process.env replacement to avoid injecting large host env objects
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
  esbuild: {
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },
});

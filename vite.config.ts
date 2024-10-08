import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
    plugins: [
        sveltekit(),
         nodePolyfills({
        protocolImports: true,
    }),],
    optimizeDeps: {
        esbuildOptions: {
          // Node.js global to browser globalThis
          define: {
            global: 'globalThis',
          },
          // Enable esbuild polyfill plugins
          plugins: [
            NodeGlobalsPolyfillPlugin({
              buffer: true,
              process: true,
            }),
          ],
        },
      },
      resolve: {
        alias: {
          // These aliases make sure that the polyfills are used
          stream: 'stream-browserify',
          buffer: 'buffer',
          process: 'process/browser',
          util: 'util',
        },
      },
});

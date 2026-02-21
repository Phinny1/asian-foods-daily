// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';
import remarkToc from './src/plugins/remark-toc.mjs';

/** @type {import('astro').AstroUserConfig} */
export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  site: 'https://www.asianfoodsdaily.com',
  integrations: [
    sitemap(), // Added sitemap integration
    mdx(),
    react(),
  ],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'github-dark',
    },
    remarkPlugins: [remarkToc],
  },
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: import.meta.env.PROD ? {
        'react-dom/server': 'react-dom/server.edge',
      } : {},
    },
  },
});

// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';
import remarkGfm from 'remark-gfm';
import remarkToc from './src/plugins/remark-toc.mjs';

const siteUrl = process.env.SITE_URL || 'https://www.asianfoodsdaily.com';

/** @type {import('astro').AstroUserConfig} */
export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  site: siteUrl,
  integrations: [
    mdx(),
    sitemap(),
    react(),
  ],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'github-dark',
    },
    remarkPlugins: [remarkGfm, remarkToc],
  },
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: process.env.NODE_ENV === 'production' ? {
        'react-dom/server': 'react-dom/server.edge',
      } : {},
    },
  },
});

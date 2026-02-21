import type { APIRoute } from 'astro';

import { SITE } from '../config/site';

export const GET: APIRoute = () => {
  const content = `User-agent: *
Allow: /

Sitemap: ${new URL('/sitemap-index.xml', SITE.url)}`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};

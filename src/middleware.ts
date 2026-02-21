import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
    const url = new URL(context.request.url);
    const pathname = url.pathname;

    // 1. Force www
    if (url.hostname === 'asianfoodsdaily.com') {
        url.hostname = 'www.asianfoodsdaily.com';
        return Response.redirect(url.toString(), 301);
    }

    // 2. Force trailing slash
    // Exclude static files (anything with a dot in the last segment like .jpg, .css, .xml)
    const isFile = pathname.split('/').pop()?.includes('.');
    
    if (!pathname.endsWith('/') && !isFile) {
        url.pathname = pathname + '/';
        return Response.redirect(url.toString(), 301);
    }

    return next();
});
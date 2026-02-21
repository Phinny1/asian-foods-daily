import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ url, locals }) => {
  const runtime = locals.runtime;
  if (!runtime?.env?.DB) {
    return new Response(JSON.stringify({ comments: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const slug = url.searchParams.get('slug');
  if (!slug) {
    return new Response(JSON.stringify({ error: 'Missing slug parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { results } = await runtime.env.DB.prepare(
      'SELECT id, post_slug, username, rating, content, parent_id, created_at FROM comments WHERE post_slug = ? AND is_approved = 1 ORDER BY created_at DESC'
    ).bind(slug).all();

    return new Response(JSON.stringify({ comments: results || [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' },
    });
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return new Response(JSON.stringify({ comments: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  const runtime = locals.runtime;
  if (!runtime?.env?.DB) {
    console.error('Database binding not found in runtime.env');
    return new Response(JSON.stringify({ error: 'Database connection failed' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const db = runtime.env.DB;

  try {
    const formData = await request.formData();
    const slug = formData.get('slug')?.toString();
    const username = formData.get('username')?.toString()?.trim();
    const email = formData.get('email')?.toString()?.trim();
    const content = formData.get('content')?.toString()?.trim();
    const ratingRaw = formData.get('rating')?.toString();
    const rating = ratingRaw ? parseInt(ratingRaw) : 0;
    const parentId = formData.get('parentId')?.toString()?.trim() || null;
    const captcha = formData.get('captcha')?.toString()?.trim();
    const captchaAnswer = formData.get('captchaAnswer')?.toString()?.trim();

    // Debug logs (visible in worker logs)
    console.log(`Comment submission for ${slug}: from ${username} (${email})`);

    // Basic validation - check if fields exist and are not empty
    if (!slug || !username || !email || !content) {
      console.warn('Validation failed: missing fields', { 
        hasSlug: !!slug, 
        hasUsername: !!username, 
        hasEmail: !!email, 
        hasContent: !!content 
      });
      return new Response(
        JSON.stringify({ error: 'Please fill in all required fields (Name, Email, Comment)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Captcha validation
    if (captcha !== captchaAnswer) {
      console.warn(`Captcha failed for ${username}: expected ${captchaAnswer}, got ${captcha}`);
      return new Response(
        JSON.stringify({ error: 'Incorrect captcha answer. Please try again.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
    const createdAt = new Date().toISOString();
    const isApproved = 0; // Comments are pending by default

    await db.prepare(
      'INSERT INTO comments (id, post_slug, username, email, rating, content, parent_id, created_at, is_approved) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, slug, username, email, rating, content, parentId, createdAt, isApproved).run();

    return new Response(JSON.stringify({ success: true, message: 'Comment submitted for approval' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Comment submission error:', error);
    const message = error instanceof Error ? error.message : 'Unknown database error';
    return new Response(JSON.stringify({ error: `Failed to save comment: ${message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

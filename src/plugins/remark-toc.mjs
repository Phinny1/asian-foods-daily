/**
 * Remark plugin that injects a Table of Contents after the intro paragraphs
 * (before the first ## heading). Controlled by frontmatter `toc` field:
 * - toc: true (default) — inject TOC after intro
 * - toc: false — no TOC
 *
 * Only injects when there are 3+ headings (h2/h3).
 */

function remarkTocAfterIntro() {
  return (tree, file) => {
    const frontmatter = file.data.astro?.frontmatter;

    // Skip if TOC is explicitly disabled
    if (frontmatter?.toc === false) return;

    // Collect h2 and h3 headings
    const headings = [];
    for (const node of tree.children) {
      if (node.type === 'heading' && node.depth >= 2 && node.depth <= 3) {
        const text = extractText(node);
        const slug = slugify(text);
        headings.push({ depth: node.depth, text, slug });
      }
    }

    // Only show TOC if 3+ headings (matches existing component behavior)
    if (headings.length < 3) return;

    // Find the index of the first h2
    const firstH2Index = tree.children.findIndex(
      (node) => node.type === 'heading' && node.depth === 2,
    );

    if (firstH2Index === -1) return;

    // Build TOC as an HTML node
    const tocHtml = buildTocHtml(headings);
    const tocNode = {
      type: 'html',
      value: tocHtml,
    };

    // Insert TOC right before the first h2
    tree.children.splice(firstH2Index, 0, tocNode);
  };
}

function extractText(node) {
  let text = '';
  if (node.children) {
    for (const child of node.children) {
      if (child.type === 'text') {
        text += child.value;
      } else if (child.children) {
        text += extractText(child);
      }
    }
  }
  return text;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function buildTocHtml(headings) {
  const items = headings
    .map((h) => {
      const indent = h.depth === 3 ? ' class="remark-toc-sub"' : '';
      return `<li${indent}><a href="#${h.slug}">${escapeHtml(h.text)}</a></li>`;
    })
    .join('\n      ');

  return `<nav class="remark-toc not-prose">
    <h2 class="remark-toc-title">Table of Contents</h2>
    <ul>
      ${items}
    </ul>
  </nav>`;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default remarkTocAfterIntro;

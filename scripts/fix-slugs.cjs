const fs = require('fs');
const files = [
  'src/pages/blog/[...slug].astro',
  'src/pages/recipes/[...slug].astro',
];
files.forEach(f => {
  let s = fs.readFileSync(f, 'utf8');
  s = s.split('params: { slug: entry.id }').join("params: { slug: entry.id.replace(/\\.mdx?$/, '') }");
  s = s.split('slug: r.id,').join("slug: r.id.replace(/\\.mdx?$/, ''),");
  s = s.split('entry.id}.mdx`').join('entry.id}`');
  fs.writeFileSync(f, s);
  console.log('Patched: ' + f);
});

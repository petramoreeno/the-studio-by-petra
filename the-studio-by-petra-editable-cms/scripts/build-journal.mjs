
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const folder = join(root, 'content', 'journal');
const postsFolder = join(folder, 'posts');

await mkdir(postsFolder, { recursive: true });

const filenames = (await readdir(postsFolder))
  .filter(file => file.endsWith('.json'));

const posts = [];

for (const filename of filenames) {
  const post = JSON.parse(
    await readFile(join(postsFolder, filename), 'utf8')
  );

  if (post.published !== true) continue;

  const slug = filename.slice(0, -5);

  posts.push({
    slug,
    title: post.title || '',
    date: post.date || '',
    category: post.category || '',
    cover: post.cover || '',
    coverAlt: post.coverAlt || '',
    excerpt: post.excerpt || '',
    published: true
  });
}

posts.sort((a, b) =>
  String(b.date).localeCompare(String(a.date))
);

await writeFile(
  join(folder, 'index.json'),
  JSON.stringify(posts, null, 2) + '\n'
);

console.log(`Journal index generated: ${posts.length} published stories`);

// Automatically generate the website sitemap.

const base = 'https://thestudiobypetra.com';

const urls = [
  `${base}/`,
  `${base}/portfolio/`,
  `${base}/journal/`,
  ...posts.map(post =>
    `${base}/journal/?post=${encodeURIComponent(post.slug)}`
  )
];

const escapeXML = value => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map(url =>
    `  <url><loc>${escapeXML(url)}</loc></url>`
  ),
  '</urlset>'
].join('\n') + '\n';

await writeFile(join(root, 'sitemap.xml'), sitemap);

console.log(`Sitemap generated: ${urls.length} URLs`);

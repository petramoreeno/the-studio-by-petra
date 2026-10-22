
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const folder = join(process.cwd(), 'content', 'journal');
const postsFolder = join(folder, 'posts');
await mkdir(postsFolder, { recursive: true });
const filenames = (await readdir(postsFolder)).filter(file => file.endsWith('.json'));
const posts = [];

for (const filename of filenames) {
  const post = JSON.parse(await readFile(join(postsFolder, filename), 'utf8'));
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

posts.sort((a,b) => b.date.localeCompare(a.date));
await writeFile(join(folder, 'index.json'), JSON.stringify(posts, null, 2) + '\n');
console.log(`Journal index generated: ${posts.length} published stories`);

// Copies the seeded photos (scripts/seed-media.json) into the R2 bucket.
// Local dev:   node scripts/upload-seed-media.mjs --local
// Production:  node scripts/upload-seed-media.mjs --remote
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const target = process.argv.includes('--remote') ? '--remote' : '--local'
const bucket = 'justlovetour-media'
const items = JSON.parse(readFileSync('scripts/seed-media.json', 'utf8'))

const types = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' }
for (const { file, key } of items) {
  const contentType = types[key.split('.').pop()]
  execFileSync('npx', ['wrangler', 'r2', 'object', 'put', `${bucket}/${key}`, '--file', file, '--content-type', contentType, '--cache-control', 'public, max-age=31536000, immutable', target], { stdio: 'inherit' })
}
console.log(`Uploaded ${items.length} photos (${target}).`)

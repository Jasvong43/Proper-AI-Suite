#!/usr/bin/env node
/**
 * sync-apps.mjs — copies each suite app into public/apps/<Name>/ so Cloudflare
 * Pages can serve them as static assets.
 *
 * The apps live at the repo root (each alongside its CLAUDE.md reference doc).
 * Vite only publishes what's inside public/, so this bridges the two without
 * forcing a repo restructure.
 *
 * Single-file SPAs: index.html is the only servable artifact. Nothing else in
 * the app folders is referenced at runtime (all styling/JS is inline or CDN).
 */
import { cp, mkdir, readdir, readFile, writeFile, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public', 'apps')

const skip = new Set(['node_modules', 'public', 'dist', 'scripts', 'src', 'migrations', '.git', '.wrangler'])

async function main() {
  const entries = await readdir(ROOT, { withFileTypes: true })
  const apps = entries
    .filter((e) => e.isDirectory() && e.name.startsWith('Proper') && !skip.has(e.name))
    .map((e) => e.name)
    .sort()

  await rm(OUT, { recursive: true, force: true })
  await mkdir(OUT, { recursive: true })

  const manifest = []

  for (const app of apps) {
    const srcFile = join(ROOT, app, 'index.html')
    if (!existsSync(srcFile)) {
      console.warn(`  ! ${app}: no index.html, skipping`)
      continue
    }

    const outDir = join(OUT, app)
    await mkdir(outDir, { recursive: true })

    let html = await readFile(srcFile, 'utf8')

    // Rewrite any absolute-localhost API base baked into the shipped frontend.
    // A browser resolving `localhost` hits the visitor's own machine, so these
    // calls always failed in production.
    const localhostHits = (html.match(/https?:\/\/(?:localhost|127\.0\.0\.1):\d+/g) || []).length
    html = html.replace(/https?:\/\/(?:localhost|127\.0\.0\.1):\d+\/api/g, '/api')

    await writeFile(join(outDir, 'index.html'), html)

    manifest.push({ dir: app, title: extractTitle(html), localhostFixes: localhostHits })
    console.log(`  ✓ ${app}${localhostHits ? ` (rewrote ${localhostHits} localhost ref)` : ''}`)
  }

  await writeFile(join(OUT, '_manifest.json'), JSON.stringify(manifest, null, 2))

  console.log(`\nSynced ${manifest.length} apps -> public/apps/`)
}

function extractTitle(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i)
  return m ? m[1].trim() : 'Untitled'
}

main().catch((err) => {
  console.error('sync-apps failed:', err)
  process.exit(1)
})

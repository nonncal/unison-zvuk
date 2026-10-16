// Copy the reviewed public-domain bundle; never synthesize replacement music.
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { format, resolveConfig } from 'prettier'

const check = process.argv.includes('--check')
const frontend = new URL('../', import.meta.url)
const source = new URL('../../backend/catalog/', import.meta.url)
const manifest = JSON.parse(readFileSync(new URL('manifest.json', source), 'utf8'))
const catalog = manifest.tracks.map((track, index) => {
  const audio = readFileSync(new URL(`audio/${track.file}`, source))
  if (
    audio.length !== track.sizeBytes ||
    createHash('sha256').update(audio).digest('hex') !== track.sha256
  ) {
    throw new Error(`Catalog audio checksum mismatch: ${track.slug}`)
  }
  const target = new URL(`public/audio/demo-${index + 1}.mp3`, frontend)
  writeOrCheck(target, audio)
  return {
    id: `demo-${index + 1}`,
    title: track.title,
    artist: track.artist,
    durationMs: track.durationMs,
    status: 'ready',
    mediaVersion: track.sha256,
    cover: track.cover,
    source: 'catalog',
  }
})
const catalogUrl = new URL('src/entities/track/api/demo-catalog.ts', frontend)
writeOrCheck(
  catalogUrl,
  Buffer.from(
    await format(
      '// Generated from backend/catalog/manifest.json by npm run audio:generate.\n' +
        "import type { Track } from '../model/types'\n" +
        `export const catalog: Track[] = ${JSON.stringify(catalog, null, 2)}\n`,
      { ...(await resolveConfig(fileURLToPath(catalogUrl))), parser: 'typescript' },
    ),
  ),
)

function writeOrCheck(url, bytes) {
  if (check) {
    if (!readFileSync(url).equals(bytes))
      throw new Error(`Catalog copy is out of date: ${fileURLToPath(url)}`)
  } else {
    mkdirSync(new URL('.', url), { recursive: true })
    writeFileSync(url, bytes)
  }
}

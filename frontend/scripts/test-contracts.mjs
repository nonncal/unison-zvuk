import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
const { parseCommand, parseEvent, parseHTTP, ProtocolError } = await import(
  process.env.UNISON_PROTOCOL_BUNDLE
    ? pathToFileURL(process.env.UNISON_PROTOCOL_BUNDLE).href
    : '../src/shared/api/protocol.ts'
)

const fixtures = JSON.parse(
  await readFile(new URL('../../backend/contracts/fixtures-v1.json', import.meta.url), 'utf8'),
)
for (const fixture of fixtures) {
  const parse = () =>
    fixture.kind === 'command'
      ? parseCommand(fixture.json)
      : fixture.kind === 'event'
        ? parseEvent(fixture.json)
        : parseHTTP(fixture.schema, fixture.json)
  if (fixture.valid) assert.doesNotThrow(parse, fixture.name)
  else assert.throws(parse, ProtocolError, fixture.name)
}
assert.throws(() => parseCommand(' '.repeat(16_385)), ProtocolError)
console.log(`${fixtures.length} common HTTP/WS fixtures passed in TypeScript`)

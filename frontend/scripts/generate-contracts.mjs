import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import Ajv from 'ajv/dist/2020.js'
import standalone from 'ajv/dist/standalone/index.js'
import { compile } from 'json-schema-to-typescript'

const checking = process.argv.includes('--check')
async function save(url, content) {
  if (checking) {
    if ((await readFile(url, 'utf8')) !== content)
      throw new Error(`Outdated contract: ${fileURLToPath(url)}`)
  } else await writeFile(url, content)
}

const contracts = new URL('../../backend/contracts/', import.meta.url)
const output = new URL('../src/shared/api/generated/', import.meta.url)
await mkdir(output, { recursive: true })
const ajv = new Ajv({
  strict: true,
  allErrors: false,
  inlineRefs: false,
  code: { source: true, esm: true, lines: true },
})
ajv.addFormat('uuid', /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
const exports = {}
for (const [file, name] of [
  ['client-command-v1', 'ClientCommand'],
  ['server-event-v1', 'ServerEvent'],
  ['http-v1', 'HTTPMessage'],
]) {
  const schema = JSON.parse(await readFile(new URL(`${file}.schema.json`, contracts), 'utf8'))
  delete schema.discriminator
  const id = `urn:unison:${file}`
  schema.$id = id
  schema.title = name
  ajv.addSchema(schema)
  const types = await compile(schema, name, {
    bannerComment: '/* Types from the versioned JSON Schema. */',
    unreachableDefinitions: false,
    additionalProperties: false,
  })
  await save(new URL(`${file}.ts`, output), types)
  if (file === 'http-v1') {
    const names = schema.anyOf.map((ref) => ref.$ref.split('/').at(-1))
    const map = `import type { ${names.join(', ')} } from './http-v1'\n\nexport interface HTTPModels {\n${names.map((name) => `  ${name}: ${name}`).join('\n')}\n}\n`
    await save(new URL('http-models.ts', output), map)
    for (const name of names) exports[`http${name}`] = `${id}#/$defs/${name}`
  } else {
    exports[name === 'ClientCommand' ? 'validateCommand' : 'validateEvent'] = id
  }
}
let validators = standalone(ajv, exports)
const imports = []
validators = validators.replace(/require\("([^"\n]+)"\)/g, (_, dependency) => {
  const variable = `runtime${imports.length}`
  imports.push(`import ${variable} from '${dependency}.js'`)
  return variable
})
await save(new URL('validators.js', output), imports.join('\n') + '\n' + validators)
await save(
  new URL('validators.d.ts', output),
  `import type { ValidateFunction } from 'ajv'\n${Object.keys(exports)
    .map((name) => `export const ${name}: ValidateFunction<unknown>`)
    .join('\n')}\n`,
)
console.log(`Contracts generated in ${fileURLToPath(output)}`)

import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
const root = fileURLToPath(new URL('../src/', import.meta.url))
const layers = ['shared', 'entities', 'features', 'widgets', 'pages', 'app']
const errors = []
async function visit(folder) {
  for (const item of await readdir(folder, { withFileTypes: true })) {
    const file = path.join(folder, item.name)
    if (item.isDirectory()) {
      if (item.name !== 'generated') await visit(file)
      continue
    }
    if (!/\.(ts|tsx)$/.test(file)) continue
    const sourcePath = path.relative(root, file).split(path.sep)
    const sourceLayer = sourcePath[0]
    if (!layers.includes(sourceLayer) && sourcePath.join('/') !== 'main.tsx')
      errors.push(`${sourcePath.join('/')}: unknown FSD layer`)
    const source = ts.createSourceFile(
      file,
      await readFile(file, 'utf8'),
      ts.ScriptTarget.Latest,
      true,
    )
    function check(specifier) {
      if (!specifier.startsWith('@/') && !specifier.startsWith('.')) return
      const target = specifier.startsWith('@/')
        ? specifier.slice(2)
        : path
            .relative(root, path.resolve(path.dirname(file), specifier))
            .split(path.sep)
            .join('/')
      const targetPath = target.split('/')
      const targetLayer = targetPath[0]
      if (!layers.includes(targetLayer)) {
        errors.push(`${sourcePath.join('/')}: import outside FSD layers: ${specifier}`)
        return
      }
      if (sourceLayer === 'app' || sourcePath.join('/') === 'main.tsx') return
      const ownSlice =
        sourceLayer === targetLayer && (sourceLayer === 'shared' || sourcePath[1] === targetPath[1])
      const crossEntity =
        sourceLayer === 'entities' &&
        targetLayer === 'entities' &&
        targetPath[2] === '@x' &&
        targetPath[3] === sourcePath[1] &&
        targetPath.length === 4
      if (!ownSlice && !crossEntity && layers.indexOf(targetLayer) >= layers.indexOf(sourceLayer))
        errors.push(`${sourcePath.join('/')}: forbidden layer/slice import: ${specifier}`)
      if (!ownSlice && !crossEntity && targetLayer !== 'shared' && targetPath.length !== 2)
        errors.push(`${sourcePath.join('/')}: use the slice public API: ${specifier}`)
      if (
        !ownSlice &&
        targetLayer === 'shared' &&
        targetPath[1] !== 'api' &&
        targetPath[1] !== 'config' &&
        targetPath.length > 3
      )
        errors.push(`${sourcePath.join('/')}: use the shared module public API: ${specifier}`)
      if (!ownSlice && targetLayer === 'shared' && targetPath[1] === 'api' && targetPath.length > 2)
        errors.push(`${sourcePath.join('/')}: use shared/api public API: ${specifier}`)
    }
    function walk(node) {
      if (
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      )
        check(node.moduleSpecifier.text)
      if (
        ts.isCallExpression(node) &&
        node.expression.kind === ts.SyntaxKind.ImportKeyword &&
        ts.isStringLiteral(node.arguments[0])
      )
        check(node.arguments[0].text)
      ts.forEachChild(node, walk)
    }
    walk(source)
  }
}
await visit(root)
if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else console.log('FSD layers, slice isolation and public APIs verified')

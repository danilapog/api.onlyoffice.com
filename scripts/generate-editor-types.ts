import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { EditorConfigRootSchema } from '../src/components/ConfigEditor/config.schema'

type AnySchema = Record<string, any>

interface InterfaceDef {
    name: string
    description?: string
    properties: PropertyDef[]
}

interface PropertyDef {
    name: string
    type: string
    optional: boolean
    description?: string
    examples?: unknown[]
}

const interfaces: InterfaceDef[] = []
const registered = new WeakMap<object, string>()

function getMetadata(schema: AnySchema): { description?: string; examples?: unknown[] } | undefined {
    if (!Array.isArray(schema.pipe)) return undefined
    for (const item of schema.pipe) {
        if (item?.kind === 'metadata' && item.metadata != null) return item.metadata
    }
    return undefined
}

function unwrapOptional(schema: AnySchema): { schema: AnySchema; optional: boolean } {
    if (schema.type === 'optional') return { schema: schema.wrapped, optional: true }
    return { schema, optional: false }
}

function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

function toTypeStr(schema: AnySchema, name: string, inUnion = false): string {
    switch (schema.type) {
        case 'string':  return 'string'
        case 'boolean': return 'boolean'
        case 'number':  return 'number'
        case 'unknown': return 'unknown'
        case 'null':    return 'null'

        case 'picklist':
            return (schema.options as string[]).map((o) => `'${o}'`).join(' | ')

        case 'array': {
            const itemStr = toTypeStr(schema.item, `${name}Item`)
            // Wrap in parens if item is a union so that [] binds correctly
            const needsParens = schema.item.type === 'union' || (schema.item.options && schema.item.type !== 'picklist')
            return needsParens ? `(${itemStr})[]` : `${itemStr}[]`
        }

        case 'union': {
            const parts = (schema.options as AnySchema[]).map((opt, i) =>
                toTypeStr(opt, `${name}Option${i}`, true),
            )
            return parts.join(' | ')
        }

        case 'record': {
            const valStr = toTypeStr(schema.value, `${name}Value`)
            return `Record<string, ${valStr}>`
        }

        case 'object': {
            if (inUnion) return inlineObject(schema, name)
            return registerInterface(schema, name)
        }

        default:
            return 'unknown'
    }
}

function inlineObject(objectSchema: AnySchema, name: string): string {
    const entries: string[] = []
    for (const [key, raw] of Object.entries<AnySchema>(objectSchema.entries ?? {})) {
        const { schema, optional } = unwrapOptional(raw)
        const propStr = toTypeStr(schema, `${name}${capitalize(key)}`, true)
        entries.push(`${key}${optional ? '?' : ''}: ${propStr}`)
    }
    return entries.length ? `{ ${entries.join('; ')} }` : 'Record<string, never>'
}

function registerInterface(objectSchema: AnySchema, name: string): string {
    if (registered.has(objectSchema)) return registered.get(objectSchema)!
    registered.set(objectSchema, name)

    const meta = getMetadata(objectSchema)
    const properties: PropertyDef[] = []

    for (const [key, raw] of Object.entries<AnySchema>(objectSchema.entries ?? {})) {
        const { schema: inner, optional } = unwrapOptional(raw)
        const propMeta = getMetadata(inner) ?? getMetadata(raw)
        const propName = `${name}${capitalize(key)}`
        const type = toTypeStr(inner, propName)

        properties.push({
            name: key,
            type,
            optional,
            description: propMeta?.description,
            examples: propMeta?.examples,
        })
    }

    interfaces.push({ name, description: meta?.description, properties })
    return name
}

toTypeStr(EditorConfigRootSchema, 'EditorConfig')

function renderJsDoc(description?: string, examples?: unknown[]): string[] {
    const lines: string[] = []
    const hasDesc = description && description.trim()
    const hasEx = examples && examples.length > 0
    if (!hasDesc && !hasEx) return lines

    lines.push('    /**')
    if (hasDesc) lines.push(`     * ${description}`)
    if (hasEx) {
        for (const ex of examples!) {
            lines.push(`     * @example ${JSON.stringify(ex)}`)
        }
    }
    lines.push('     */')
    return lines
}

const chunks: string[] = [
    '// Auto-generated from config.schema.ts — do not edit manually.',
    '// Re-generate: scripts/generate-editor-types.ts',
    '',
]

for (const iface of interfaces) {
    if (iface.description) chunks.push(`/** ${iface.description} */`)
    chunks.push(`export interface ${iface.name} {`)
    for (const prop of iface.properties) {
        const jsDoc = renderJsDoc(prop.description, prop.examples)
        chunks.push(...jsDoc)
        chunks.push(`    ${prop.name}${prop.optional ? '?' : ''}: ${prop.type}`)
    }
    chunks.push('}')
    chunks.push('')
}

const output = chunks.join('\n')

const outPath = join(
    dirname(fileURLToPath(import.meta.url)),
    '../src/components/ConfigEditor/editor-config.gen.ts',
)
writeFileSync(outPath, output, 'utf8')
console.log(`Generated ${outPath}`)

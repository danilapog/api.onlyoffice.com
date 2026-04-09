import type { JsonSchema } from '@jsonforms/core'

export function populateDefaults(
    schema: JsonSchema,
    data: unknown,
    rootSchema: JsonSchema,
): unknown {
    if (schema.$ref) {
        const resolved = resolveRef(schema.$ref, rootSchema)
        if (resolved) return populateDefaults(resolved, data, rootSchema)
    }

    if (schema.type === 'object' && schema.properties) {
        const obj = (data && typeof data === 'object' && !Array.isArray(data))
            ? { ...data as Record<string, unknown> }
            : {}

        for (const [key, propSchema] of Object.entries(schema.properties)) {
            const prop = propSchema as JsonSchema
            const value = obj[key]
            if (value !== undefined) {
                obj[key] = populateDefaults(prop, value, rootSchema)
            } else if (prop.default !== undefined) {
                obj[key] = structuredClone(prop.default)
            } else if (prop.type === 'object' && prop.properties) {
                obj[key] = populateDefaults(prop, undefined, rootSchema)
            }
        }
        return obj
    }

    if (schema.type === 'array') {
        if (Array.isArray(data)) return data
        if (schema.default !== undefined) return structuredClone(schema.default)
        return data
    }

    if (data !== undefined) return data
    if (schema.default !== undefined) return structuredClone(schema.default)
    return data
}

function resolveRef(ref: string, rootSchema: JsonSchema): JsonSchema | undefined {
    if (!ref.startsWith('#/')) return undefined
    const parts = ref.slice(2).split('/')
    let current: unknown = rootSchema
    for (const part of parts) {
        if (current && typeof current === 'object') {
            current = (current as Record<string, unknown>)[part]
        } else {
            return undefined
        }
    }
    return current as JsonSchema | undefined
}

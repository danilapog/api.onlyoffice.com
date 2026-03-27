import * as v from 'valibot'
import { EditorConfigRootSchema } from '../config.schema'

export type ConfigNodeType =
    | 'string'
    | 'number'
    | 'boolean'
    | 'object'
    | 'array'
    | 'null'
    | 'unknown'

export interface SchemaNode {
    type?: string | string[]
    enum?: unknown[]
    oneOf?: SchemaNode[]
    anyOf?: SchemaNode[]
    properties?: Record<string, SchemaNode>
    items?: SchemaNode
    description?: string
    examples?: unknown[]
    default?: unknown
}

export interface ConfigNode {
    id: string
    key: string
    value: unknown
    type: ConfigNodeType
    schemaNode?: SchemaNode
    children?: ConfigNode[]
    depth: number
}

export interface ConfigEditorState {
    nodes: ConfigNode[]
    commentedIds: Set<string>
    collapsedIds: Set<string>
    validationErrors: Map<string, string>
    defaultConfig: Record<string, unknown>
    schema: SchemaNode
    useSchemaDefaults: boolean
}

export type ConfigEditorAction =
    | { type: 'SET_VALUE'; id: string; value: unknown }
    | { type: 'TOGGLE_COMMENT'; id: string }
    | { type: 'TOGGLE_COLLAPSE'; id: string }
    | { type: 'SET_VALIDATION_ERRORS'; errors: Map<string, string> }
    | { type: 'RESET' }
    | { type: 'IMPORT_CONFIG'; config: Record<string, unknown> }

function resolveSchemaNode(schema: SchemaNode | undefined): SchemaNode | undefined {
    if (!schema) return undefined
    const branches = schema.oneOf ?? schema.anyOf
    if (!branches) return schema
    // Prefer boolean branch; otherwise take first branch
    const bool = branches.find((b) => b.type === 'boolean')
    const resolved = bool ?? branches[0]
    // Carry over description from parent
    if (resolved && schema.description) {
        return { ...resolved, description: schema.description }
    }
    return resolved
}

function inferType(value: unknown, schema?: SchemaNode): ConfigNodeType {
    if (schema?.type) {
        const t = Array.isArray(schema.type) ? schema.type[0] : schema.type
        if (t === 'string') return 'string'
        if (t === 'number' || t === 'integer') return 'number'
        if (t === 'boolean') return 'boolean'
        if (t === 'object') return 'object'
        if (t === 'array') return 'array'
        if (t === 'null') return 'null'
    }
    if (value === null) return 'null'
    if (typeof value === 'boolean') return 'boolean'
    if (typeof value === 'number') return 'number'
    if (typeof value === 'string') return 'string'
    if (Array.isArray(value)) return 'array'
    if (typeof value === 'object') return 'object'
    if (typeof value === 'function') return 'unknown'
    return 'unknown'
}

function getSchemaDefaultValue(rawSchema: SchemaNode): unknown {
    if (rawSchema.default !== undefined) return rawSchema.default
    if (rawSchema.examples !== undefined && rawSchema.examples.length > 0)
        return rawSchema.examples[0]
    return undefined
}

function buildNodes(
    config: Record<string, unknown>,
    schema: SchemaNode | undefined,
    parentId: string,
    depth: number,
    useSchemaDefaults: boolean,
): ConfigNode[] {
    if (typeof config !== 'object' || config === null || Array.isArray(config)) return []

    const schemaProps = schema?.properties ?? {}

    // When useSchemaDefaults: union of schema keys + config keys (schema order first)
    // When !useSchemaDefaults: only iterate over config keys (original behaviour)
    const keys: string[] = useSchemaDefaults
        ? [...new Set([...Object.keys(schemaProps), ...Object.keys(config)])]
        : Object.keys(config)

    const nodes: ConfigNode[] = []

    for (const key of keys) {
        const rawSchema = schemaProps[key]
        const resolvedSchema = resolveSchemaNode(rawSchema)

        let val: unknown
        const inConfig = Object.prototype.hasOwnProperty.call(config, key)

        if (inConfig) {
            val = config[key]
        } else if (rawSchema && useSchemaDefaults) {
            val = getSchemaDefaultValue(rawSchema)

            if (val === undefined) {
                // For objects that have nested properties, recurse with an empty base
                const schemaType = resolvedSchema?.type
                const t = Array.isArray(schemaType) ? schemaType[0] : schemaType
                if (t === 'object' && resolvedSchema?.properties) {
                    val = {}
                } else {
                    continue // No default/example available — skip leaf
                }
            }
        } else {
            continue
        }

        if (typeof val === 'function') continue

        const id = parentId ? `${parentId}.${key}` : key
        const type = inferType(val, resolvedSchema)

        const node: ConfigNode = {
            id,
            key,
            value: val,
            type,
            schemaNode: resolvedSchema,
            depth,
        }

        if (type === 'object' && typeof val === 'object' && val !== null && !Array.isArray(val)) {
            node.children = buildNodes(
                val as Record<string, unknown>,
                resolvedSchema,
                id,
                depth + 1,
                useSchemaDefaults,
            )
        }

        nodes.push(node)
    }
    return nodes
}

export function buildInitialState(
    config: Record<string, unknown>,
    schema: SchemaNode,
    useSchemaDefaults = true,
): ConfigEditorState {
    return {
        nodes: buildNodes(config, schema, '', 0, useSchemaDefaults),
        commentedIds: new Set(),
        collapsedIds: new Set(),
        validationErrors: new Map(),
        defaultConfig: config,
        schema,
        useSchemaDefaults,
    }
}

export function buildConfig(
    nodes: ConfigNode[],
    commentedIds: Set<string>,
): Record<string, unknown> {
    const result: Record<string, unknown> = {}
    for (const node of nodes) {
        if (commentedIds.has(node.id)) continue
        if (node.type === 'object' && node.children) {
            result[node.key] = buildConfig(node.children, commentedIds)
        } else {
            result[node.key] = node.value
        }
    }
    return result
}

export function validateConfig(
    config: Record<string, unknown>,
    _schema: SchemaNode,
): Map<string, string> {
    const result = v.safeParse(EditorConfigRootSchema, config)
    if (result.success) return new Map()
    const errors = new Map<string, string>()
    for (const issue of result.issues) {
        const path = issue.path?.map((p) => String(p.key)).join('.') ?? ''
        errors.set(path, issue.message)
    }
    return errors
}

function updateNodeValue(nodes: ConfigNode[], id: string, value: unknown): ConfigNode[] {
    return nodes.map((node) => {
        if (node.id === id) {
            return { ...node, value }
        }
        if (node.children) {
            return { ...node, children: updateNodeValue(node.children, id, value) }
        }
        return node
    })
}

export function configEditorReducer(
    state: ConfigEditorState,
    action: ConfigEditorAction,
): ConfigEditorState {
    switch (action.type) {
        case 'SET_VALUE':
            return { ...state, nodes: updateNodeValue(state.nodes, action.id, action.value) }

        case 'TOGGLE_COMMENT': {
            const next = new Set(state.commentedIds)
            if (next.has(action.id)) next.delete(action.id)
            else next.add(action.id)
            return { ...state, commentedIds: next }
        }

        case 'TOGGLE_COLLAPSE': {
            const next = new Set(state.collapsedIds)
            if (next.has(action.id)) next.delete(action.id)
            else next.add(action.id)
            return { ...state, collapsedIds: next }
        }

        case 'SET_VALIDATION_ERRORS':
            return { ...state, validationErrors: action.errors }

        case 'RESET':
            return buildInitialState(state.defaultConfig, state.schema, state.useSchemaDefaults)

        case 'IMPORT_CONFIG':
            return buildInitialState(action.config, state.schema, state.useSchemaDefaults)

        default:
            return state
    }
}

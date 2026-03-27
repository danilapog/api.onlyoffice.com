import { ComponentProps, useCallback, useEffect, useMemo, useReducer } from 'react'
import {
    buildConfig,
    buildInitialState,
    configEditorReducer,
    validateConfig,
} from './reducer'
import type { SchemaNode } from './reducer'
import { ConfigEditorRootContext } from './ConfigEditorRootContext'
import type { ConfigEditorRootContext as ConfigEditorRootContextType } from './ConfigEditorRootContext'

export type ConfigEditorRootProps = ComponentProps<'div'> & {
    defaultConfig: Record<string, unknown>
    schema: SchemaNode
    onApply: (config: Record<string, unknown>) => void
    /** Build tree for ALL schema properties using default/examples values. Default: true */
    useSchemaDefaults?: boolean
}

export function ConfigEditorRoot({
    defaultConfig,
    schema,
    onApply,
    useSchemaDefaults = true,
    ...props
}: ConfigEditorRootProps) {
    const [state, dispatch] = useReducer(
        configEditorReducer,
        undefined,
        () => buildInitialState(defaultConfig, schema, useSchemaDefaults),
    )

    useEffect(() => {
        const config = buildConfig(state.nodes, state.commentedIds)
        const errors = validateConfig(config, schema)
        dispatch({ type: 'SET_VALIDATION_ERRORS', errors })
    }, [state.nodes, state.commentedIds, schema])

    const handleApply = useCallback(() => {
        onApply(buildConfig(state.nodes, state.commentedIds))
    }, [onApply, state.nodes, state.commentedIds])

    const handleCopy = useCallback(async () => {
        const config = buildConfig(state.nodes, state.commentedIds)
        await navigator.clipboard.writeText(JSON.stringify(config, null, 2))
    }, [state.nodes, state.commentedIds])

    const handleImport = useCallback(async () => {
        try {
            const text = await navigator.clipboard.readText()
            const config = JSON.parse(text) as Record<string, unknown>
            dispatch({ type: 'IMPORT_CONFIG', config })
        } catch {
            alert('Failed to import: clipboard does not contain valid JSON.')
        }
    }, [dispatch])

    const contextValue = useMemo<ConfigEditorRootContextType>(
        () => ({
            ...state,
            dispatch,
            onApply: handleApply,
            onCopy: handleCopy,
            onImport: handleImport,
        }),
        [state, handleApply, handleCopy, handleImport],
    )

    return <ConfigEditorRootContext.Provider value={contextValue} {...props} />
}

export namespace ConfigEditorRoot {
    export type Props = ConfigEditorRootProps
}

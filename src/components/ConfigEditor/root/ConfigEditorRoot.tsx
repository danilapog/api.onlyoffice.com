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

    const handleExport = useCallback(() => {
        const config = buildConfig(state.nodes, state.commentedIds)
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'config.json'
        a.click()
        URL.revokeObjectURL(url)
    }, [state.nodes, state.commentedIds])

    const contextValue = useMemo<ConfigEditorRootContextType>(
        () => ({
            ...state,
            dispatch,
            onApply: handleApply,
            onExport: handleExport,
        }),
        [state, handleApply, handleExport],
    )

    return <ConfigEditorRootContext.Provider value={contextValue} {...props} />
}

export namespace ConfigEditorRoot {
    export type Props = ConfigEditorRootProps
}

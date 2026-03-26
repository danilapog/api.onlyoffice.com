import { Dispatch, createContext, useContext } from 'react'
import type { ConfigEditorState, ConfigEditorAction } from './reducer'

export interface ConfigEditorRootContext extends ConfigEditorState {
    dispatch: Dispatch<ConfigEditorAction>
    onApply: () => void
    onExport: () => void
}

export const ConfigEditorRootContext = createContext<ConfigEditorRootContext | undefined>(undefined)

export function useConfigEditorContext(): ConfigEditorRootContext {
    const value = useContext(ConfigEditorRootContext)
    if (value === undefined) {
        throw new Error(
            'ConfigEditorRootContext is missing. Parts must be placed within <ConfigEditor.Root>.',
        )
    }
    return value
}

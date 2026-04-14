import { JsonForms } from '@jsonforms/react'
import type { JsonSchema } from '@jsonforms/core'
import { useEffect, useMemo, useState, useCallback } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import * as Tooltip from '@radix-ui/react-tooltip'
import MonacoEditor from '@monaco-editor/react'
import { useColorMode } from '@docusaurus/theme-common/internal'
import schema from '@site/static/schemas/config.json'
import { renderers } from './renderers'
import { populateDefaults } from './utils/populateDefaults'
import styles from './index.module.css'

interface ConfigEditorProps {
    defaultConfig: Record<string, unknown>
    onApply: (config: Record<string, unknown>) => void
}

export function ConfigEditor({ defaultConfig, onApply }: ConfigEditorProps) {
    const { colorMode } = useColorMode()

    const initialFormData = useMemo(
        () => populateDefaults(schema as JsonSchema, defaultConfig, schema as JsonSchema) as Record<string, unknown>,
        [defaultConfig],
    )

    const [formData, setFormData] = useState<Record<string, unknown>>(initialFormData)
    const [jsonText, setJsonText] = useState(() => JSON.stringify(initialFormData, null, 2))
    const [copyLabel, setCopyLabel] = useState('Copy')

    useEffect(() => {
        setFormData(initialFormData)
        setJsonText(JSON.stringify(initialFormData, null, 2))
        onApply(initialFormData)
    }, [initialFormData])

    const handleFormChange = useCallback(({ data }: { data: Record<string, unknown> }) => {
        const updated = data ?? {}
        setFormData(updated)
        setJsonText(JSON.stringify(updated, null, 2))
    }, [])

    const handleJsonChange = useCallback((value: string) => {
        setJsonText(value)
        try {
            const parsed = JSON.parse(value)
            setFormData(parsed)
        } catch {
            // invalid JSON — keep current formData
        }
    }, [])

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(jsonText)
            setCopyLabel('Copied!')
            setTimeout(() => setCopyLabel('Copy'), 2000)
        } catch {
            alert('Failed to copy to clipboard.')
        }
    }

    return (
        <Tooltip.Provider delayDuration={200}>
        <div className={styles.root}>
            <Tabs.Root defaultValue="form" className={styles.tabs}>
                <Tabs.List className={styles.tabsList}>
                    <Tabs.Trigger value="form" className={styles.tabsTrigger}>Form</Tabs.Trigger>
                    <Tabs.Trigger value="json" className={styles.tabsTrigger}>JSON</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="form" className={styles.tabsContent}>
                    <div className={styles.formWrapper}>
                        <div className={styles.form}>
                            <JsonForms
                                schema={schema as JsonSchema}
                                data={formData}
                                renderers={renderers}
                                onChange={handleFormChange}
                                validationMode="NoValidation"
                            />
                        </div>
                    </div>
                </Tabs.Content>
                <Tabs.Content value="json" className={styles.tabsContent}>
                    <div className={styles.jsonTabWrapper}>
                        <button className={styles.copyButton} onClick={handleCopy} type="button">
                            {copyLabel}
                        </button>
                        <MonacoEditor
                            language="json"
                            value={jsonText}
                            onChange={(v) => handleJsonChange(v ?? '')}
                            theme={colorMode === 'dark' ? 'vs-dark' : 'vs-light'}
                            options={{
                                minimap: {enabled: false},
                                scrollBeyondLastLine: false,
                                fontSize: 14,
                                lineNumbers: 'on',
                                renderLineHighlight: 'all',
                                automaticLayout: true,
                                fixedOverflowWidgets: true,
                            }}
                        />
                    </div>
                </Tabs.Content>
            </Tabs.Root>
            <button
                className={styles.applyButton}
                onClick={() => onApply(formData)}
                type="button"
            >
                Apply
            </button>
        </div>
        </Tooltip.Provider>
    )
}

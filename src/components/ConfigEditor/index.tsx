import { JsonForms } from '@jsonforms/react'
import type { JsonSchema } from '@jsonforms/core'
import { useEffect, useMemo, useState } from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'
import schema from '@site/static/schemas/config.json'
import { renderers } from './renderers'
import { populateDefaults } from './utils/populateDefaults'
import styles from './index.module.css'

interface ConfigEditorProps {
    defaultConfig: Record<string, unknown>
    onApply: (config: Record<string, unknown>) => void
}

export function ConfigEditor({ defaultConfig, onApply }: ConfigEditorProps) {
    const initialFormData = useMemo(
        () => populateDefaults(schema as JsonSchema, defaultConfig, schema as JsonSchema) as Record<string, unknown>,
        [defaultConfig],
    )

    const [formData, setFormData] = useState<Record<string, unknown>>(initialFormData)
    const [copyLabel, setCopyLabel] = useState('Copy')

    useEffect(() => {
        onApply(initialFormData)
    }, [])

    const handleImport = async () => {
        try {
            const text = await navigator.clipboard.readText()
            const parsed = JSON.parse(text)
            setFormData(parsed)
        } catch {
            alert('Failed to read JSON from clipboard. Make sure you have valid JSON copied.')
        }
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(formData, null, 2))
            setCopyLabel('Copied!')
            setTimeout(() => setCopyLabel('Copy'), 2000)
        } catch {
            alert('Failed to copy to clipboard.')
        }
    }

    const handleReset = () => {
        setFormData(initialFormData)
    }

    const handleApply = () => {
        onApply(formData)
    }

    return (
        <Tooltip.Provider delayDuration={200}>
        <div className={styles.root}>
            <div className={styles.toolbar}>
                <button className={styles.toolbarButton} onClick={handleReset} type="button">
                    Reset
                </button>
                <button className={styles.toolbarButton} onClick={handleImport} type="button">
                    Import
                </button>
                <button className={styles.toolbarButton} onClick={handleCopy} type="button">
                    {copyLabel}
                </button>
                <button className={`${styles.toolbarButton} ${styles.toolbarButtonPrimary}`} onClick={handleApply} type="button">
                    Apply
                </button>
            </div>
            <div className={styles.formWrapper}>
                <div className={styles.form}>
                    <JsonForms
                        schema={schema as JsonSchema}
                        data={formData}
                        renderers={renderers}
                        onChange={({ data }) => setFormData(data ?? {})}
                        validationMode="NoValidation"
                    />
                </div>
            </div>
        </div>
        </Tooltip.Provider>
    )
}

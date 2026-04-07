import Form, { getDefaultRegistry } from '@rjsf/core'
import { DescriptionFieldProps, FieldTemplateProps, RJSFSchema, UiSchema, WidgetProps } from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'
import { useEffect, useRef, useState } from 'react'
import schema from '@site/static/schemas/config.json'
import styles from './index.module.css'
import * as Tooltip from '@radix-ui/react-tooltip'

function InfoTooltip({ text }: { text: string }) {
    return (
        <Tooltip.Root>
            <Tooltip.Trigger asChild>
                <span className={styles.tooltipIcon}>i</span>
            </Tooltip.Trigger>
            <Tooltip.Portal>
                <Tooltip.Content className={styles.tooltipContent} sideOffset={6}>
                    {text}
                    <Tooltip.Arrow className={styles.tooltipArrow} />
                </Tooltip.Content>
            </Tooltip.Portal>
        </Tooltip.Root>
    )
}

function DescriptionFieldTemplate(_props: DescriptionFieldProps) {
    return null
}

const DefaultSelectWidget = getDefaultRegistry().widgets.SelectWidget

function SelectWidget(props: WidgetProps) {
    const patched = { ...props.schema, default: props.schema.default ?? props.schema.enum?.[0] }
    return <DefaultSelectWidget {...props} schema={patched} />
}

function FieldTemplate({ id, label, required, hidden, children, errors, schema: fieldSchema, displayLabel }: FieldTemplateProps) {
    if (hidden) return <div className={styles.hiddenField}>{children}</div>

    const description = fieldSchema.description as string | undefined
    const isCheckbox = fieldSchema.type === 'boolean'
    const shouldShowLabel = (displayLabel && label) || isCheckbox

    return (
        <div className={styles.field}>
            {shouldShowLabel && label && (
                <label htmlFor={id} className={styles.fieldLabelRow}>
                    <span>
                        {label}
                        {required && <span className={styles.required}> *</span>}
                    </span>
                    {description && <InfoTooltip text={description} />}
                </label>
            )}
            {children}
            {errors}
        </div>
    )
}

const uiSchema: UiSchema = {
    'ui:submitButtonOptions': { norender: true },
    token: { 'ui:widget': 'hidden' },
}

interface ConfigEditorProps {
    defaultConfig: Record<string, unknown>
    onApply: (config: Record<string, unknown>) => void
}

export function ConfigEditor({ defaultConfig, onApply }: ConfigEditorProps) {
    const [formData, setFormData] = useState<Record<string, unknown>>(defaultConfig)
    const [copyLabel, setCopyLabel] = useState('Copy')
    const formRef = useRef<Form>(null)

    useEffect(() => {
        onApply(defaultConfig)
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

    const handleApply = () => {
        onApply(formData)
    }

    return (
        <Tooltip.Provider delayDuration={200}>
        <div className={styles.root}>
            <div className={styles.toolbar}>
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
                <Form
                    ref={formRef}
                    schema={schema as RJSFSchema}
                    uiSchema={uiSchema}
                    validator={validator}
                    formData={formData}
                    onChange={({ formData: data }) => setFormData(data ?? {})}
                    onSubmit={({ formData: data }) => onApply(data ?? {})}
                    liveValidate={false}
                    templates={{ FieldTemplate, DescriptionFieldTemplate }}
                    widgets={{ SelectWidget }}
                    className={styles.form}
                />
            </div>
        </div>
        </Tooltip.Provider>
    )
}

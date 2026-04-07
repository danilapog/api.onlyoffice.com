import Form, { getDefaultRegistry } from '@rjsf/core'
import { DescriptionFieldProps, FieldTemplateProps, ObjectFieldTemplateProps, RJSFSchema, UiSchema, WidgetProps, getDefaultFormState } from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'
import { useEffect, useMemo, useRef, useState } from 'react'
import schema from '@site/static/schemas/config.json'
import styles from './index.module.css'
import * as Tooltip from '@radix-ui/react-tooltip'

const defaultFormStateBehavior = {
    emptyObjectFields: 'populateAllDefaults' as const,
    allOf: 'populateDefaults' as const,
    mergeDefaultsIntoFormData: 'useDefaultIfFormDataUndefined' as const,
}

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

    if (isCheckbox) {
        return (
            <div className={`${styles.field} ${styles.fieldCheckbox}`}>
                {children}
                {label && (
                    <label htmlFor={id} className={styles.fieldLabelRow}>
                        <span>
                            {label}
                            {required && <span className={styles.required}> *</span>}
                        </span>
                        {description && <InfoTooltip text={description} />}
                    </label>
                )}
                {errors}
            </div>
        )
    }

    return (
        <div className={styles.field}>
            {displayLabel && label && (
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

function ObjectFieldTemplate({ title, properties, fieldPathId, schema: fieldSchema }: ObjectFieldTemplateProps) {
    const depth = fieldPathId.path.length
    const [open, setOpen] = useState(false)

    if (depth === 0) {
        return <>{properties.map(p => p.content)}</>
    }

    const description = fieldSchema.description as string | undefined
    const detailsClass = styles.details
    const chevronClass = open ? `${styles.chevron} ${styles.chevronOpen}` : styles.chevron

    return (
        <details className={detailsClass} onToggle={(e) => setOpen(e.currentTarget.open)}>
            <summary className={styles.summary}>
                <svg className={chevronClass} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {title}
                {description && <InfoTooltip text={description} />}
            </summary>
            <div className={styles.detailsContent}>
                {properties.map(p => p.content)}
            </div>
        </details>
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
    const initialFormData = useMemo(
        () => getDefaultFormState(validator, schema as RJSFSchema, defaultConfig, schema as RJSFSchema, false, defaultFormStateBehavior) as Record<string, unknown>,
        [defaultConfig],
    )

    const [formData, setFormData] = useState<Record<string, unknown>>(initialFormData)
    const [copyLabel, setCopyLabel] = useState('Copy')
    const formRef = useRef<Form>(null)

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
                <Form
                    ref={formRef}
                    schema={schema as RJSFSchema}
                    uiSchema={uiSchema}
                    validator={validator}
                    formData={formData}
                    onChange={({ formData: data }) => setFormData(data ?? {})}
                    onSubmit={({ formData: data }) => onApply(data ?? {})}
                    liveValidate={false}
                    experimental_defaultFormStateBehavior={defaultFormStateBehavior}
                    templates={{ FieldTemplate, DescriptionFieldTemplate, ObjectFieldTemplate }}
                    widgets={{ SelectWidget }}
                    className={styles.form}
                />
            </div>
        </div>
        </Tooltip.Provider>
    )
}

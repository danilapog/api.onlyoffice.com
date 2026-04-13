import { useState } from 'react'
import { ArrayControlProps, composePaths, createDefaultValue, isObjectArrayControl, isPrimitiveArrayControl, JsonSchema, or, rankWith } from '@jsonforms/core'
import { JsonFormsDispatch, withJsonFormsArrayControlProps } from '@jsonforms/react'
import { Chevron } from '../../utils/Chevron'
import { InfoTooltip } from '../../utils/InfoTooltip'
import styles from '../../index.module.css'

function PrimitiveArrayItem({ path, schema, enabled, handleChange, value }: {
    path: string
    schema: JsonSchema
    enabled: boolean
    handleChange: (path: string, value: unknown) => void
    value: unknown
}) {
    const type = schema.type === 'number' || schema.type === 'integer' ? 'number' : 'text'
    return (
        <input
            type={type}
            value={(value as string) ?? ''}
            onChange={(e) => {
                const raw = e.target.value
                if (raw === '') handleChange(path, undefined)
                else if (schema.type === 'integer') handleChange(path, parseInt(raw, 10))
                else if (schema.type === 'number') handleChange(path, parseFloat(raw))
                else handleChange(path, raw)
            }}
            disabled={!enabled}
        />
    )
}

function ArrayControlRenderer({
    label,
    data,
    path,
    schema,
    rootSchema,
    enabled,
    visible,
    uischema,
    addItem,
    removeItems,
    handleChange,
    renderers,
}: ArrayControlProps) {
    const [open, setOpen] = useState(false)

    if (!visible || !schema) return null

    const isObjectItems = schema.type === 'object' && schema.properties
    const description = findArrayDescription(rootSchema, uischema.scope)
    const items = Array.isArray(data) ? data : []
    const parentScope = uischema.scope

    return (
        <details className={styles.details} onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}>
            <summary className={styles.summary}>
                <Chevron open={open} />
                {label}
                {description && <InfoTooltip text={description} />}
            </summary>
            <div className={styles.detailsContent}>
                {items.map((_item, index) => {
                    const childPath = composePaths(path, `${index}`)
                    return (
                        <div key={index} className={styles.arrayItem}>
                            <div className={styles.arrayItemHeader}>
                                <span className={styles.arrayItemIndex}>Item {index + 1}</span>
                                {removeItems && (
                                    <button
                                        className={styles.arrayRemoveButton}
                                        onClick={removeItems(path, [index])}
                                        disabled={!enabled}
                                        type="button"
                                        aria-label="Remove item"
                                    >
                                        &times;
                                    </button>
                                )}
                            </div>
                            <div className={styles.arrayItemFields}>
                                {isObjectItems ? (
                                    Object.keys(schema.properties!).map((key) => {
                                        const propPath = composePaths(childPath, key)
                                        const propScope = `${parentScope}/items/properties/${key}`
                                        return (
                                            <JsonFormsDispatch
                                                key={key}
                                                uischema={{ type: 'Control', scope: propScope }}
                                                path={propPath}
                                                renderers={renderers}
                                            />
                                        )
                                    })
                                ) : (
                                    <PrimitiveArrayItem
                                        path={childPath}
                                        schema={schema}
                                        enabled={enabled}
                                        handleChange={handleChange}
                                        value={_item}
                                    />
                                )}
                            </div>
                        </div>
                    )
                })}
                <button
                    className={`${styles.toolbarButton} ${styles.arrayAddButton}`}
                    onClick={addItem(path, createDefaultValue(schema, rootSchema))}
                    disabled={!enabled}
                    type="button"
                >
                    + Add item
                </button>
            </div>
        </details>
    )
}

function findArrayDescription(rootSchema: JsonSchema, scope: string): string | undefined {
    const parts = scope.replace(/^#\//, '').split('/')
    let current: unknown = rootSchema
    for (const part of parts) {
        if (current && typeof current === 'object') {
            current = (current as Record<string, unknown>)[part]
        } else {
            return undefined
        }
    }
    return (current as JsonSchema | undefined)?.description
}

export const arrayControlTester = rankWith(5, or(isObjectArrayControl, isPrimitiveArrayControl))

export const ArrayControl = withJsonFormsArrayControlProps(ArrayControlRenderer)

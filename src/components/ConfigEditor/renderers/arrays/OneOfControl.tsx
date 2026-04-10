import { useState, useCallback } from 'react'
import { CombinatorRendererProps, createDefaultValue, isOneOfControl, JsonSchema, rankWith } from '@jsonforms/core'
import { JsonFormsDispatch, withJsonFormsOneOfProps } from '@jsonforms/react'
import { InfoTooltip } from '../../utils/InfoTooltip'
import styles from '../../index.module.css'

function getOptionLabel(schema: JsonSchema, index: number): string {
    if (schema.title) return schema.title
    if (schema.description) return truncate(schema.description, 80)
    if (schema.type === 'array') {
        const itemType = (schema.items as JsonSchema | undefined)?.type
        return itemType ? `List of ${itemType}s` : 'List'
    }
    if (schema.type) return String(schema.type)
    return `Option ${index + 1}`
}

function truncate(text: string, max: number): string {
    if (text.length <= max) return text
    return `${text.slice(0, max - 1).trimEnd()}…`
}

function OneOfControlRenderer({
    label,
    description,
    required,
    schema,
    rootSchema,
    path,
    renderers,
    cells,
    id,
    enabled,
    visible,
    indexOfFittingSchema,
    handleChange,
    uischemas,
}: CombinatorRendererProps) {
    const oneOfSchemas = schema.oneOf as JsonSchema[] | undefined ?? []
    const [selectedIndex, setSelectedIndex] = useState(
        indexOfFittingSchema >= 0 ? indexOfFittingSchema : 0,
    )

    const handleSelectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const newIndex = parseInt(e.target.value, 10)
        setSelectedIndex(newIndex)
        const newSchema = oneOfSchemas[newIndex]
        if (newSchema) {
            handleChange(path, createDefaultValue(newSchema, rootSchema))
        }
    }, [oneOfSchemas, path, rootSchema, handleChange])

    if (!visible) return null

    const selectedSchema = oneOfSchemas[selectedIndex]

    return (
        <div className={styles.field}>
            {label && (
                <label htmlFor={id} className={styles.fieldLabelRow}>
                    <span>
                        {label}
                        {required && <span className={styles.required}> *</span>}
                    </span>
                    {description && <InfoTooltip text={description} />}
                </label>
            )}
            <div className={styles.multiSchema}>
                <select
                    id={id}
                    value={selectedIndex}
                    onChange={handleSelectChange}
                    disabled={!enabled}
                >
                    {oneOfSchemas.map((s, i) => (
                        <option key={i} value={i}>{getOptionLabel(s, i)}</option>
                    ))}
                </select>
                {selectedSchema && (
                    <JsonFormsDispatch
                        schema={selectedSchema}
                        uischema={undefined}
                        path={path}
                        renderers={renderers}
                        cells={cells}
                        uischemas={uischemas}
                    />
                )}
            </div>
        </div>
    )
}

export const oneOfControlTester = rankWith(6, isOneOfControl)

export const OneOfControl = withJsonFormsOneOfProps(OneOfControlRenderer)

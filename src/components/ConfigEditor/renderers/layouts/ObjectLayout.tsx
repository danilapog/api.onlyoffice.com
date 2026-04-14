import { useState } from 'react'
import { ControlProps, isObjectControl, JsonSchema, rankWith } from '@jsonforms/core'
import { JsonFormsDispatch, withJsonFormsControlProps } from '@jsonforms/react'
import { Chevron } from '../../utils/Chevron'
import { InfoTooltip } from '../../utils/InfoTooltip'
import styles from '../../index.module.css'

function ObjectLayoutRenderer({ schema, path, visible, renderers, cells, uischema }: ControlProps) {
    const [open, setOpen] = useState(true)

    if (!visible) return null

    const properties = schema.properties ?? {}
    const propertyKeys = Object.keys(properties)

    const childElements = propertyKeys.map((key) => {
        const childPath = path ? `${path}.${key}` : key
        const childSchema = properties[key] as JsonSchema

        return (
            <JsonFormsDispatch
                key={key}
                schema={childSchema}
                uischema={{ type: 'Control', scope: '#' }}
                path={childPath}
                renderers={renderers}
                cells={cells}
            />
        )
    })

    if (!path) {
        return <>{childElements}</>
    }

    const title = schema.title ?? uischema.label ?? path.split('.').pop() ?? ''
    const description = schema.description

    return (
        <details open className={styles.details} onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}>
            <summary className={styles.summary}>
                <Chevron open={open} />
                {title}
                {description && <InfoTooltip text={description} />}
            </summary>
            <div className={styles.detailsContent}>
                {childElements}
            </div>
        </details>
    )
}

export const objectLayoutTester = rankWith(5, isObjectControl)

export const ObjectLayout = withJsonFormsControlProps(ObjectLayoutRenderer)

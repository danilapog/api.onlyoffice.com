import { ControlProps, isEnumControl, rankWith } from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'
import { useEffect } from 'react'
import { InfoTooltip } from '../../utils/InfoTooltip'
import styles from '../../index.module.css'

function EnumControlRenderer({ id, label, data, path, schema, description, required, enabled, handleChange }: ControlProps) {
    const options = schema.enum as string[] | undefined ?? []
    const defaultValue = schema.default ?? options[0]

    useEffect(() => {
        if (data === undefined && defaultValue !== undefined) {
            handleChange(path, defaultValue)
        }
    }, [])

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
            <select
                id={id}
                value={data ?? defaultValue ?? ''}
                onChange={(e) => handleChange(path, e.target.value)}
                disabled={!enabled}
            >
                {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    )
}

export const enumControlTester = rankWith(4, isEnumControl)

export const EnumControl = withJsonFormsControlProps(EnumControlRenderer)

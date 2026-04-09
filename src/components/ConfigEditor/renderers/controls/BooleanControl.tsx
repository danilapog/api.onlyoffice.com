import { ControlProps, isBooleanControl, rankWith } from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'
import { InfoTooltip } from '../../utils/InfoTooltip'
import styles from '../../index.module.css'

function BooleanControlRenderer({ id, label, data, path, description, required, enabled, handleChange }: ControlProps) {
    return (
        <div className={`${styles.field} ${styles.fieldCheckbox}`}>
            <input
                id={id}
                type="checkbox"
                checked={!!data}
                onChange={(e) => handleChange(path, e.target.checked)}
                disabled={!enabled}
            />
            {label && (
                <label htmlFor={id} className={styles.fieldLabelRow}>
                    <span>
                        {label}
                        {required && <span className={styles.required}> *</span>}
                    </span>
                    {description && <InfoTooltip text={description} />}
                </label>
            )}
        </div>
    )
}

export const booleanControlTester = rankWith(3, isBooleanControl)

export const BooleanControl = withJsonFormsControlProps(BooleanControlRenderer)

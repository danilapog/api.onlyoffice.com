import { and, isControl, rankWith, scopeEndIs } from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'
import styles from '../../index.module.css'

function HiddenControlRenderer() {
    return <div className={styles.hiddenField} />
}

export const hiddenControlTester = rankWith(10, and(isControl, scopeEndIs('token')))

export const HiddenControl = withJsonFormsControlProps(HiddenControlRenderer)

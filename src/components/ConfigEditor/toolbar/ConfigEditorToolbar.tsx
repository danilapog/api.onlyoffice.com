import { useConfigEditorContext } from '../root/ConfigEditorRootContext'
import styles from './ConfigEditorToolbar.module.css'

export function ConfigEditorToolbar() {
    const { onApply, onCopy, onImport } = useConfigEditorContext()
    return (
        <div className={styles.toolbar}>
            <span className={styles.title}>Config Editor</span>
            <div className={styles.actions}>
                <button className={styles.toolbarButton} onClick={onImport}>
                    Import JSON
                </button>
                <button className={styles.toolbarButton} onClick={onCopy}>
                    Copy JSON
                </button>
                <button className={`${styles.toolbarButton} ${styles.toolbarButtonPrimary}`} onClick={onApply}>
                    Apply
                </button>
            </div>
        </div>
    )
}

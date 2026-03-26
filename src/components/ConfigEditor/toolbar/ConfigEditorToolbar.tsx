import { useConfigEditorContext } from '../root/ConfigEditorRootContext'
import styles from './ConfigEditorToolbar.module.css'

export function ConfigEditorToolbar() {
    const { onApply, onExport } = useConfigEditorContext()
    return (
        <div className={styles.toolbar}>
            <span className={styles.title}>Config Editor</span>
            <div className={styles.actions}>
                <button className="button button--outline button--sm" onClick={onExport}>
                    Export JSON
                </button>
                <button className="button button--primary button--sm" onClick={onApply}>
                    Apply
                </button>
            </div>
        </div>
    )
}

import { useConfigEditorContext } from '../root/ConfigEditorRootContext'
import styles from './ConfigEditorToolbar.module.css'

export function ConfigEditorToolbar() {
    const { onApply, onCopy, onImport } = useConfigEditorContext()
    return (
        <div className={styles.toolbar}>
            <span className={styles.title}>Config Editor</span>
            <div className={styles.actions}>
                <button className="button button--outline button--sm" onClick={onImport}>
                    Import JSON
                </button>
                <button className="button button--outline button--sm" onClick={onCopy}>
                    Copy JSON
                </button>
                <button className="button button--primary button--sm" onClick={onApply}>
                    Apply
                </button>
            </div>
        </div>
    )
}

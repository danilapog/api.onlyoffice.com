import Head from '@docusaurus/Head'
import { ColorModeProvider } from '@docusaurus/theme-common/internal'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { JsonEditor, JsonValue } from '@visual-json/react'
import { useEffect, useRef, useState } from 'react'
// @ts-ignore — static asset resolved at runtime by webpack
import schema from '/schemas/config.json'
import { EditorPreview, EditorPreviewRef } from '@site/src/components/EditorPreview'
import { SplitPane } from '@site/src/components/SplitPane'
import styles from './config.module.css'

const defaultConfig: JsonValue = {
    documentType: 'word',
    document: {
        fileType: 'docx',
        key: 'demo-key-default',
        title: 'Example Document.docx',
        url: 'https://static.onlyoffice.com/assets/docs/samples/demo.docx',
    },
    editorConfig: {
        callbackUrl: '',
    },
    height: '100%',
    width: '100%',
}

const withFreshKey = (config: JsonValue): Record<string, any> => {
    const cfg = config as Record<string, any>
    return {
        ...cfg,
        document: {
            ...cfg?.document,
            key: '0' + Math.random(),
        },
    }
}

const ConfigEditorInner = () => {
    const {
        siteConfig: { customFields },
    } = useDocusaurusContext()

    const documentServerUrl = customFields.documentServer as string
    const documentServerSecret = customFields.documentServerSecret as string

    const [draftConfig, setDraftConfig] = useState<JsonValue>(defaultConfig)
    const editorRef = useRef<EditorPreviewRef>(null)

    useEffect(() => {
        editorRef.current?.initEditor(withFreshKey(defaultConfig))
    }, [])

    const handleApply = () => {
        editorRef.current?.initEditor(withFreshKey(draftConfig))
    }

    return (
        <div className={styles.configPage}>
            <div className={styles.toolbar}>
                <span className={styles.title}>Config Editor</span>
                <button className="button button--primary button--sm" onClick={handleApply}>
                    Apply
                </button>
            </div>
            <SplitPane
                first={
                    <JsonEditor
                        value={draftConfig}
                        schema={schema as any}
                        onChange={(v) => setDraftConfig(v)}
                    />
                }
                second={
                    <EditorPreview
                        ref={editorRef}
                        documentServerUrl={documentServerUrl}
                        documentServerSecret={documentServerSecret}
                    />
                }
            />
        </div>
    )
}

const ConfigEditorRoute = () => (
    <ColorModeProvider>
        <Head>Config Editor | ONLYOFFICE</Head>
        <ConfigEditorInner/>
    </ColorModeProvider>
)

export default ConfigEditorRoute

import Head from '@docusaurus/Head'
import { ColorModeProvider } from '@docusaurus/theme-common/internal'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useEffect, useRef } from 'react'
// @ts-ignore — static asset resolved at runtime by webpack
import schema from '/schemas/config.json'
import { EditorPreview, EditorPreviewRef } from '@site/src/components/EditorPreview'
import { SplitPane } from '@site/src/components/SplitPane'
import { ConfigEditor } from '@site/src/components/ConfigEditor'
import styles from './config.module.css'

const defaultConfig = {
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

const withFreshKey = (config: Record<string, any>): Record<string, any> => ({
    ...config,
    document: {
        ...config?.document,
        key: '0' + Math.random(),
    },
})

const ConfigEditorInner = () => {
    const {
        siteConfig: { customFields },
    } = useDocusaurusContext()

    const documentServerUrl = customFields.documentServer as string
    const documentServerSecret = customFields.documentServerSecret as string
    const editorRef = useRef<EditorPreviewRef>(null)

    useEffect(() => {
        editorRef.current?.initEditor(withFreshKey(defaultConfig))
    }, [])

    const handleApply = (config: Record<string, unknown>) => {
        editorRef.current?.initEditor(withFreshKey(config))
    }

    return (
        <div className={styles.container}>
            <ConfigEditor.Root defaultConfig={defaultConfig} schema={schema} onApply={handleApply}>
                <ConfigEditor.Toolbar />
                <SplitPane
                    first={<ConfigEditor.Tree />}
                    second={
                        <EditorPreview
                            ref={editorRef}
                            documentServerUrl={documentServerUrl}
                            documentServerSecret={documentServerSecret}
                        />
                    }
                />
            </ConfigEditor.Root>
        </div>
    )
}

const ConfigEditorRoute = () => (
    <ColorModeProvider>
        <Head>Config Editor | ONLYOFFICE</Head>
        <ConfigEditorInner />
    </ColorModeProvider>
)

export default ConfigEditorRoute

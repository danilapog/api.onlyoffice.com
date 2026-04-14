import Head from '@docusaurus/Head'
import BrowserOnly from '@docusaurus/BrowserOnly'
import { ColorModeProvider, useColorMode } from '@docusaurus/theme-common/internal'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useMemo, useRef } from 'react'
import { EditorPreview, EditorPreviewRef } from '@site/src/components/EditorPreview'
import { SplitPane } from '@site/src/components/SplitPane'
import { ConfigEditor } from '@site/src/components/ConfigEditor'
import styles from './config-editor.module.css'

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
    const { colorMode } = useColorMode()
    const editorRef = useRef<EditorPreviewRef>(null)
    const latestConfigRef = useRef<Record<string, any> | null>(null)

    const defaultConfig = useMemo<Record<string, unknown>>(() => ({
        documentType: 'word',
        type: 'desktop',
        width: '100%',
        height: '100%',
        document: {
            fileType: 'docx',
            key: 'demo-document-key',
            title: 'Example Document Title.docx',
            url: 'https://static.onlyoffice.com/assets/docs/samples/demo.docx',
        },
        editorConfig: {
            callbackUrl: documentServerUrl + 'dummyCallback',
            user: { id: 'userID', name: 'Developer' },
            customization: {
                uiTheme: colorMode === 'dark' ? 'default-dark' : 'default-light',
                features: { featuresTips: false },
            },
            lang: 'en',
        },
    }), [documentServerUrl, colorMode])

    const handleApply = (config: Record<string, unknown>) => {
        const c = withFreshKey(config)
        latestConfigRef.current = c
        editorRef.current?.initEditor(c)
    }

    const handlePreviewReady = () => {
        if (latestConfigRef.current) {
            editorRef.current?.initEditor(latestConfigRef.current)
        }
    }

    return (
        <div className={styles.container}>
            <SplitPane
                first={
                    <ConfigEditor
                        defaultConfig={defaultConfig}
                        onApply={handleApply}
                    />
                }
                second={
                    <EditorPreview
                        ref={editorRef}
                        documentServerUrl={documentServerUrl}
                        documentServerSecret={documentServerSecret}
                        onReady={handlePreviewReady}
                    />
                }
            />
        </div>
    )
}

const ConfigEditorRoute = () => (
    <ColorModeProvider>
        <Head>Config Editor | ONLYOFFICE</Head>
        <BrowserOnly fallback={null}>
            {() => <ConfigEditorInner />}
        </BrowserOnly>
    </ColorModeProvider>
)

export default ConfigEditorRoute

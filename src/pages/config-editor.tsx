import Head from '@docusaurus/Head'
import BrowserOnly from '@docusaurus/BrowserOnly'
import { ColorModeProvider, useColorMode } from '@docusaurus/theme-common/internal'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useMemo, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { EditorPreview, EditorPreviewRef } from '@site/src/components/EditorPreview'
import { SplitPane } from '@site/src/components/SplitPane'
import { ConfigEditor } from '@site/src/components/ConfigEditor'
import styles from './config-editor.module.css'

type DocumentType = 'word' | 'cell' | 'slide' | 'form' | 'pdf'

const DOCUMENT_TYPE_CONFIG: Record<DocumentType, { fileType: string; docType: string; url: string; title: string }> = {
    word: {
        fileType: 'docx',
        docType: 'word',
        url: 'https://static.onlyoffice.com/assets/docs/samples/demo.docx',
        title: 'Example Document Title.docx',
    },
    cell: {
        fileType: 'xlsx',
        docType: 'cell',
        url: 'https://static.onlyoffice.com/assets/docs/samples/demo.xlsx',
        title: 'Example Spreadsheet.xlsx',
    },
    slide: {
        fileType: 'pptx',
        docType: 'slide',
        url: 'https://static.onlyoffice.com/assets/docs/samples/demo.pptx',
        title: 'Example Presentation.pptx',
    },
    form: {
        fileType: 'oform',
        docType: 'word',
        url: 'https://static.onlyoffice.com/assets/docs/samples/demo-invoice.oform',
        title: 'Example Form.oform',
    },
    pdf: {
        fileType: 'pdf',
        docType: 'pdf',
        url: 'https://static.onlyoffice.com/assets/docs/samples/demo.pdf',
        title: 'Example PDF.pdf',
    },
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

    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const documentType = (params.get('documentType') ?? 'word') as DocumentType
    const docConfig = DOCUMENT_TYPE_CONFIG[documentType] ?? DOCUMENT_TYPE_CONFIG.word

    const documentServerUrl = customFields.documentServer as string
    const documentServerSecret = customFields.documentServerSecret as string
    const { colorMode } = useColorMode()
    const editorRef = useRef<EditorPreviewRef>(null)
    const latestConfigRef = useRef<Record<string, any> | null>(null)

    const defaultConfig = useMemo<Record<string, unknown>>(() => ({
        documentType: docConfig.docType,
        type: 'desktop',
        width: '100%',
        height: '100%',
        document: {
            fileType: docConfig.fileType,
            key: 'demo-document-key',
            title: docConfig.title,
            url: docConfig.url,
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
    }), [documentServerUrl, colorMode, documentType])

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

import { useCallback, useEffect, useRef } from "react"
import { usePlaygroundRootContext } from "@site/src/components/Playground"
import { EditorPreview, EditorPreviewRef } from "@site/src/components/EditorPreview"
import { getFullUrl } from "@site/src/utils/url"
import { EditorType } from "@site/src/components/Playground/root/PlaygroundRootContext"
import { FILE_CONFIGS, SAMPLE_FILE_CONFIGS } from "../defaultScripts"

type FileConfig = { ext: string; docType: string; url: string }

function getDocumentUrl(
    templateUrl: string | null | undefined,
    fileConfig: FileConfig,
    editorType: EditorType
): string {
    if (templateUrl === null) {
        const name = editorType === 'form' ? 'demo-invoice' : 'new'
        return `https://static.onlyoffice.com/assets/docs/samples/${name}.${fileConfig.ext}`
    }
    if (templateUrl) return templateUrl
    return fileConfig.url
}

export const PlaygroundPreview = () => {
    const {
        theme,
        scriptValue,
        previewType,
        scriptType,
        editorType,
        documentServerUrl,
        documentServerSecret,
        templateUrl,
        hasInitialScript,
        documentType,
    } = usePlaygroundRootContext()

    const editorRef = useRef<EditorPreviewRef>(null)
    const connectorRef = useRef<any>(null)
    const initialScriptExecutedRef = useRef(!hasInitialScript)

    const scriptValueRef = useRef(scriptValue)
    const scriptTypeRef = useRef(scriptType)
    const editorTypeRef = useRef(editorType)
    scriptValueRef.current = scriptValue
    scriptTypeRef.current = scriptType
    editorTypeRef.current = editorType

    const executeCode = useCallback((script: string, type: string) => {
        const connector = connectorRef.current
        if (!connector) {
            console.log('Please wait for editor to load...')
            return
        }

        try {
            switch (type) {
                case 'office-js-api':
                    connector.callCommand(new Function(script))
                    break
                case 'connector': {
                    const fn = new Function('connector', script)
                    fn(connector)
                    break
                }
                case 'plugin':
                    connector.executeMethod('SetPluginsOptions', [
                        { 'asc.{D764D084-C77A-4A3E-A157-A9A1E442BCFC}': { codeExecute: script } },
                    ])
                    break
                case 'builder': {
                    const removeMethod: Record<string, string> = {
                        word: 'Api.GetDocument().RemoveAllElements();',
                        cell: 'Api.AddSheet("Sheet 1");var sheets = Api.GetSheets(); for (var shInd = 0; shInd < sheets.length - 1; shInd++){ sheets[shInd].Delete(); }',
                        slide: 'var oPresentation = Api.GetPresentation(); var nSlidesCount = oPresentation.GetSlidesCount(); for(var nSlideIdx = nSlidesCount - 1; nSlideIdx > -1; --nSlideIdx) { oPresentation.GetSlideByIndex(nSlideIdx).Delete(); } oPresentation.AddSlide(Api.CreateSlide());',
                        form: 'Api.GetDocument().RemoveAllElements();',
                        pdf: 'let doc = Api.GetDocument();for(let i = doc.GetPagesCount()-1; i > 0; i--) {doc.RemovePage(i);} doc.AddPage(1);doc.RemovePage(0);',
                    }
                    const builderScript =
                        (removeMethod[editorTypeRef.current] ?? '') +
                        script
                            .replaceAll('builder.CreateFile', '')
                            .replaceAll('builder.SaveFile', '')
                            .replaceAll('builder.CloseFile()', '')
                            .replaceAll('\n', '')
                    connector.callCommand(new Function(builderScript))
                    break
                }
            }
        } catch (error) {
            console.error('Error executing code:', error)
        }
    }, [])

    const buildConfig = useCallback(() => {
        const configs = documentType === 'sample' ? SAMPLE_FILE_CONFIGS : FILE_CONFIGS
        const fileConfig = (configs[editorType] ?? configs.word) as FileConfig
        return {
            document: {
                fileType: fileConfig.ext,
                key: '0' + Math.random(),
                title: `Example Document Title.${fileConfig.ext}`,
                url: getDocumentUrl(templateUrl, fileConfig, editorType),
            },
            documentType: fileConfig.docType,
            type: previewType,
            editorConfig: {
                callbackUrl: documentServerUrl + 'dummyCallback',
                user: { id: 'userID', name: 'Developer' },
                customization: {
                    uiTheme: theme === 'dark' ? 'default-dark' : 'default-light',
                    mobile: { disableForceDesktop: true },
                    features: { featuresTips: false },
                },
                lang: 'en',
            },
            height: '100%',
            width: '100%',
            events: {
                onDocumentReady: () => {
                    try {
                        connectorRef.current = window.docEditor.createConnector()

                        const pluginConfigUrl = getFullUrl('/plugin/config.json')
                        // TODO: Remove after release 9.4.0, as installDeveloperPlugin will be available directly on the connector object
                        const installPluginShim: Record<string, string> = {
                            word: 'gg.ud.yJj=gg.ud.installDeveloperPlugin;',
                            pdf: 'gg.ud.yJj=gg.ud.installDeveloperPlugin;',
                            cell: 'zi.je.Xok=zi.je.installDeveloperPlugin;',
                            slide: '$g.le.Prj=$g.le.installDeveloperPlugin;',
                        }
                        connectorRef.current.callCommand(
                            new Function(`${installPluginShim[fileConfig.docType] || ''}Api.installDeveloperPlugin("${pluginConfigUrl}");`)
                        )

                        if (!initialScriptExecutedRef.current) {
                            initialScriptExecutedRef.current = true
                            executeCode(scriptValueRef.current, scriptTypeRef.current)
                        }
                    } catch (error) {
                        console.error('Failed to initialize connector:', error)
                    }
                },
            },
        }
    }, [editorType, documentType, previewType, templateUrl, theme, documentServerUrl, executeCode])

    useEffect(() => {
        editorRef.current?.initEditor(buildConfig())
    }, [buildConfig])

    useEffect(() => {
        const handleRun = () => {
            if (scriptValue) executeCode(scriptValue, scriptType)
        }
        window.addEventListener('playground-run', handleRun)
        return () => window.removeEventListener('playground-run', handleRun)
    }, [scriptValue, scriptType, executeCode])

    const handleReady = useCallback(() => {
        editorRef.current?.initEditor(buildConfig())
    }, [buildConfig])

    return (
        <EditorPreview
            ref={editorRef}
            documentServerUrl={documentServerUrl}
            documentServerSecret={documentServerSecret}
            onReady={handleReady}
        />
    )
}

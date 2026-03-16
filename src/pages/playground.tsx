import { Playground } from "../components/Playground";
import styles from './playground.module.css';
import { ColorModeProvider } from "@docusaurus/theme-common/internal";
import { useLocation } from "react-router-dom";
import { EditorType, PreviewType, ScriptType } from "@site/src/components/Playground/root/PlaygroundRootContext";
import Head from '@docusaurus/Head';
import BrowserOnly from "@docusaurus/BrowserOnly";
import { getSearchParams } from "@site/src/utils/url";
import { lazy, Suspense } from "react";
import { SplitPane } from "@site/src/components/SplitPane";

const PlaygroundLazyEditor = lazy(() =>
    import('../components/Playground').then(m => ({ default: m.Playground.Editor })),
)

const PlaygroundRoute = () => {
    const location = useLocation();

    const { templateUrl, emptyTemplateUrl, ...props } = getSearchParams<{
        editorType: EditorType
        scriptType: ScriptType
        previewType: PreviewType
        initialScript: string
        documentServerUrl: string
        documentServerSecret: string
        templateUrl: string
        emptyTemplateUrl?: string
    }>(location.search, {
        editorType: 'editor',
        scriptType: 'testType',
        previewType: 'preview',
        initialScript: 'code',
        documentServerUrl: 'documentServerUrl',
        documentServerSecret: 'documentServerSecret',
        templateUrl: 'templateUrl',
        emptyTemplateUrl: 'emptyTemplateUrl'
    });

    return (
        <ColorModeProvider>
            <Head>
                <title>Playground | ONLYOFFICE</title>
            </Head>
            <BrowserOnly>
                {() => (
                    <div className={styles.playgroundContainer}>
                        <Playground.Root templateUrl={emptyTemplateUrl !== undefined ? null : templateUrl} {...props}>
                            <Playground.Toolbar/>
                            <SplitPane
                                first={<Suspense><PlaygroundLazyEditor /></Suspense>}
                                second={<Playground.Preview/>}
                            />
                        </Playground.Root>
                    </div>
                )}
            </BrowserOnly>
        </ColorModeProvider>
    )
}

export default PlaygroundRoute;
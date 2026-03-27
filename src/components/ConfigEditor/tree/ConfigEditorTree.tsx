import { useConfigEditorContext } from '../root/ConfigEditorRootContext'
import type { ConfigNode } from '../root/reducer'
import { ConfigEditorNode } from './ConfigEditorNode'
import styles from './ConfigEditorTree.module.css'

function flattenNodes(
    nodes: ConfigNode[],
    collapsedIds: Set<string>,
    commentedIds: Set<string>,
): ConfigNode[] {
    const result: ConfigNode[] = []
    for (const node of nodes) {
        result.push(node)
        if (node.children && !collapsedIds.has(node.id)) {
            result.push(...flattenNodes(node.children, collapsedIds, commentedIds))
        }
    }
    return result
}

export function ConfigEditorTree() {
    const { nodes, collapsedIds, commentedIds } = useConfigEditorContext()
    const flatList = flattenNodes(nodes, collapsedIds, commentedIds)

    return (
        <div className={styles.tree}>
            {flatList.map((node) => (
                <ConfigEditorNode key={node.id} node={node} />
            ))}
        </div>
    )
}

export namespace ConfigEditorTree {
    export type Props = Record<string, never>
}

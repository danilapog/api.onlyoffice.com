import * as Select from '@radix-ui/react-select'
import { useCallback, useEffect, useRef } from 'react'
import { useConfigEditorContext } from '../root/ConfigEditorRootContext'
import type { ConfigNode } from '../root/reducer'
import styles from './ConfigEditorNode.module.css'

interface Props {
    node: ConfigNode
}

function isAncestorCommented(id: string, commentedIds: Set<string>): boolean {
    const parts = id.split('.')
    for (let i = 1; i < parts.length; i++) {
        if (commentedIds.has(parts.slice(0, i).join('.'))) return true
    }
    return false
}

export function ConfigEditorNode({ node }: Props) {
    const { dispatch, commentedIds, collapsedIds, validationErrors } = useConfigEditorContext()

    const isCommented = commentedIds.has(node.id)
    const isDimmed = isCommented || isAncestorCommented(node.id, commentedIds)
    const isCollapsed = collapsedIds.has(node.id)
    const error = validationErrors.get(node.id)
    const hasChildren = node.type === 'object' && (node.children?.length ?? 0) > 0

    const handleToggleComment = useCallback(() => {
        dispatch({ type: 'TOGGLE_COMMENT', id: node.id })
    }, [dispatch, node.id])

    const handleToggleCollapse = useCallback(() => {
        dispatch({ type: 'TOGGLE_COLLAPSE', id: node.id })
    }, [dispatch, node.id])

    const handleValueChange = useCallback(
        (value: unknown) => {
            dispatch({ type: 'SET_VALUE', id: node.id, value })
        },
        [dispatch, node.id],
    )

    return (
        <div
            className={[
                styles.row,
                isDimmed ? styles.commented : '',
                error ? styles.hasError : '',
            ]
                .filter(Boolean)
                .join(' ')}
            style={{ '--depth': node.depth } as React.CSSProperties}
        >
            {/* Left gutter — comment toggle */}
            <button
                className={styles.gutter}
                onClick={handleToggleComment}
                title={isCommented ? 'Uncomment this field' : 'Comment out this field'}
                aria-label={isCommented ? 'Uncomment' : 'Comment out'}
            >
                <span className={styles.gutterDot} />
            </button>

            {/* Indentation + collapse triangle */}
            <div className={styles.indent}>
                {hasChildren && (
                    <button
                        className={[styles.collapseBtn, isCollapsed ? styles.collapsed : '']
                            .filter(Boolean)
                            .join(' ')}
                        onClick={handleToggleCollapse}
                        aria-label={isCollapsed ? 'Expand' : 'Collapse'}
                    />
                )}
            </div>

            {/* Key */}
            <span
                className={[
                    styles.key,
                    error ? styles.keyError : '',
                    isDimmed ? styles.keyCommented : '',
                ]
                    .filter(Boolean)
                    .join(' ')}
                title={node.schemaNode?.description}
            >
                {node.key}
            </span>

            <span className={styles.colon}>:</span>

            {/* Value area — shown when not dimmed and not an expandable object */}
            {!isDimmed && !hasChildren && (
                <div className={styles.valueArea}>
                    <ValueControl node={node} onChange={handleValueChange} />
                </div>
            )}

            {/* Object summary when collapsed */}
            {hasChildren && isCollapsed && (
                <span className={styles.objectSummary}>{'{…}'}</span>
            )}

            {/* Error indicator */}
            {error && (
                <span className={styles.errorBadge} title={error} aria-label={error}>
                    !
                </span>
            )}
        </div>
    )
}

interface ValueControlProps {
    node: ConfigNode
    onChange: (value: unknown) => void
}

function ValueControl({ node, onChange }: ValueControlProps) {
    const schema = node.schemaNode

    if (schema?.enum) {
        return (
            <EnumControl
                value={String(node.value)}
                options={schema.enum.map(String)}
                onChange={onChange}
            />
        )
    }

    if (node.type === 'boolean') {
        return <ToggleControl checked={Boolean(node.value)} onChange={onChange} />
    }

    if (node.type === 'number') {
        return (
            <TextControl
                value={String(node.value ?? '')}
                onChange={(v) => {
                    const n = parseFloat(v)
                    if (!isNaN(n)) onChange(n)
                }}
            />
        )
    }

    if (node.type === 'string') {
        return <TextControl value={String(node.value ?? '')} onChange={onChange} />
    }

    if (node.type === 'array') {
        return <span className={styles.unknownValue}>{JSON.stringify(node.value)}</span>
    }

    return <span className={styles.unknownValue}>{String(node.value)}</span>
}

interface TextControlProps {
    value: string
    onChange: (v: string) => void
}

function TextControl({ value, onChange }: TextControlProps) {
    const ref = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        if (ref.current && ref.current.textContent !== value) {
            ref.current.textContent = value
        }
    }, [value])

    return (
        <span
            ref={ref}
            contentEditable
            suppressContentEditableWarning
            className={styles.textControl}
            onBlur={(e) => onChange(e.currentTarget.textContent ?? '')}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault()
                    e.currentTarget.blur()
                }
            }}
        >
            {value}
        </span>
    )
}

interface ToggleControlProps {
    checked: boolean
    onChange: (v: boolean) => void
}

function ToggleControl({ checked, onChange }: ToggleControlProps) {
    return (
        <button
            role="switch"
            aria-checked={checked}
            className={[styles.toggle, checked ? styles.toggleOn : ''].filter(Boolean).join(' ')}
            onClick={() => onChange(!checked)}
        >
            <span className={styles.toggleThumb} />
        </button>
    )
}

interface EnumControlProps {
    value: string
    options: string[]
    onChange: (v: string) => void
}

function EnumControl({ value, options, onChange }: EnumControlProps) {
    return (
        <Select.Root value={value} onValueChange={onChange}>
            <Select.Trigger className={styles.selectTrigger} aria-label="value">
                <Select.Value />
                <Select.Icon asChild>
                    <span className={styles.selectIcon} />
                </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
                <Select.Content className={styles.selectContent} position="popper" sideOffset={4}>
                    <Select.Viewport className={styles.selectViewport}>
                        {options.map((opt) => (
                            <Select.Item key={opt} value={opt} className={styles.selectItem}>
                                <Select.ItemText>{opt}</Select.ItemText>
                            </Select.Item>
                        ))}
                    </Select.Viewport>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    )
}

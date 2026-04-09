import * as Tooltip from '@radix-ui/react-tooltip'
import styles from '../index.module.css'

export function InfoTooltip({ text }: { text: string }) {
    return (
        <Tooltip.Root>
            <Tooltip.Trigger asChild>
                <span className={styles.tooltipIcon}>i</span>
            </Tooltip.Trigger>
            <Tooltip.Portal>
                <Tooltip.Content className={styles.tooltipContent} sideOffset={6}>
                    {text}
                    <Tooltip.Arrow className={styles.tooltipArrow} />
                </Tooltip.Content>
            </Tooltip.Portal>
        </Tooltip.Root>
    )
}

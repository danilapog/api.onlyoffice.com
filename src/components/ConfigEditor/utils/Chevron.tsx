import styles from '../index.module.css'

export function Chevron({ open }: { open: boolean }) {
    return (
        <svg
            className={open ? `${styles.chevron} ${styles.chevronOpen}` : styles.chevron}
            width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

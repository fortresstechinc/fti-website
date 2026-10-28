import Link from "next/link";
import { Icon } from "@/components/icons";
import { Logo } from "./Logo";
import styles from "./SlimHeader.module.css";

/**
 * The header for single-purpose pages (booking, invitations): the mark, and at
 * most one quiet thing on the right. No site nav, so the page keeps its one job.
 */
export function SlimHeader({ end }: { end?: React.ReactNode }) {
  return (
    <header className={styles.top}>
      <Logo tone="black" />
      {end}
    </header>
  );
}

/** A quiet way out, its arrow pointing back. */
export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={`label ${styles.back}`}>
      <Icon name="arrow" size={14} />
      {children}
    </Link>
  );
}

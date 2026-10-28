import Link from "next/link";
import { Icon } from "@/components/icons";
import styles from "./ArrowButton.module.css";

type Props = {
  href: string;
  children: React.ReactNode;
  /** light: white pill with ink chip. dark: ink pill with white chip. */
  tone?: "light" | "dark";
  /** Paints the chip ember; reserved for the one primary action in a view. */
  live?: boolean;
  className?: string;
};

export function ArrowButton({ href, children, tone = "dark", live = false, className }: Props) {
  const external = href.startsWith("mailto:") || href.startsWith("http");
  const cls = [styles.button, styles[tone], live ? styles.live : "", className].filter(Boolean).join(" ");
  const inner = (
    <>
      <span className={styles.text}>{children}</span>
      <span className={styles.chip}>
        <Icon name="arrow" size={14} />
      </span>
    </>
  );
  return external ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

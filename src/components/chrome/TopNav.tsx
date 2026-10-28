import Link from "next/link";
import { Logo } from "./Logo";
import styles from "./TopNav.module.css";

// The home page's sections, in page order.
const LINKS = [
  { label: "Who it's for", href: "/#who-its-for" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "What we defend", href: "/#what-we-defend" },
  { label: "Products", href: "/#products" },
  { label: "Careers", href: "/#careers" },
];

export function TopNav({ tone }: { tone: "light" | "dark" }) {
  return (
    <header className={`${styles.nav} ${tone === "dark" ? styles.dark : ""}`}>
      <div className={styles.slot}>
        <Logo tone={tone === "dark" ? "white" : "black"} />
      </div>
      <nav aria-label="Primary" className={styles.links}>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className={`label ${styles.link}`}>
            {l.label}
          </Link>
        ))}
      </nav>
      <div className={`${styles.slot} ${styles.end}`}>
        <Link href="/contact" className={`label ${styles.contact}`}>
          Contact
        </Link>
      </div>
    </header>
  );
}

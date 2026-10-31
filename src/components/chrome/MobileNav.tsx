"use client";

import { useLenis } from "lenis/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { products } from "@/content/products";
import { contact } from "@/content/site";
import { Icon } from "@/components/icons";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { Logo } from "./Logo";
import styles from "./MobileNav.module.css";

// The home page's sections, in page order.
const SECTIONS = [
  { label: "Who it's for", id: "who-its-for" },
  { label: "How it works", id: "how-it-works" },
  { label: "What we defend", id: "what-we-defend" },
  { label: "Products", id: "products" },
  { label: "Careers", id: "careers" },
];

/**
 * The phone and small-tablet navigation, in place of the desktop rail and top
 * nav: a header bar with the mark and a Menu button, which opens a full-screen
 * menu. Over the hero the bar is clear (`tone` says whether that ground is dark
 * or light); once the page moves it becomes a frosted bar. It tucks away while
 * reading down the page and returns on any scroll back up.
 */
export function MobileNav({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const pathname = usePathname();
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 24);
      // Hide after a deliberate scroll down; any scroll up brings it back.
      if (y > 160 && y - last > 6) setHidden(true);
      else if (last - y > 6 || y < 160) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The open menu holds the page still, answers Escape, and hands focus back.
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    closeButton.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      menuButton.current?.focus();
    };
  }, [open, lenis]);

  // Closing on navigation, so a product link never leaves the menu over the new page.
  useEffect(() => setOpen(false), [pathname]);

  const onHome = pathname === "/";
  const goTo = (id: string) => (e: React.MouseEvent) => {
    if (!onHome) return; // another page: a normal link to /#id
    e.preventDefault();
    setOpen(false);
    // After the menu has released the page, glide to the section.
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (!el) return;
      if (lenis) lenis.scrollTo(el, { duration: 1.2 });
      else el.scrollIntoView({ behavior: "smooth" });
    });
  };

  const clear = !solid && !open;
  return (
    <>
      <header
        className={styles.bar}
        data-solid={clear ? undefined : ""}
        data-hidden={hidden && !open ? "" : undefined}
        data-tone={clear ? tone : "light"}
      >
        <Logo tone={clear && tone === "dark" ? "white" : "black"} size={34} />
        <button
          ref={menuButton}
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen(true)}
        >
          <span className="label">Menu</span>
          <Icon name="menu" size={18} />
        </button>
      </header>

      <div id="site-menu" className={styles.sheet} data-open={open ? "" : undefined} role="dialog" aria-modal="true" aria-label="Menu" hidden={!open}>
        <div className={styles.sheetTop}>
          <Logo tone="white" size={34} />
          <button ref={closeButton} type="button" className={styles.closeButton} onClick={() => setOpen(false)}>
            <span className="label">Close</span>
            <Icon name="close" size={18} />
          </button>
        </div>

        <nav aria-label="Primary" className={styles.sections}>
          {SECTIONS.map((s) => (
            <Link key={s.id} href={`/#${s.id}`} className={styles.section} onClick={goTo(s.id)}>
              {s.label}
            </Link>
          ))}
        </nav>

        <div className={styles.products}>
          {products.map((p) => (
            <Link key={p.slug} href={`/${p.slug}`} className={styles.product} aria-current={pathname === `/${p.slug}` ? "page" : undefined}>
              <span className={styles.productName}>{p.name}</span>
              <span className={styles.productLine}>{p.tagline}</span>
            </Link>
          ))}
        </div>

        <div className={styles.sheetFoot}>
          <ArrowButton href="/contact" tone="light" live className={styles.cta}>
            Book a briefing
          </ArrowButton>
          <div className={styles.reach}>
            <a href={contact.phone.href}>{contact.phone.display}</a>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </div>
        </div>
      </div>
    </>
  );
}

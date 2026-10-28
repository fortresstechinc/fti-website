import Link from "next/link";
import { products } from "@/content/products";
import { contact } from "@/content/site";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { Logo } from "./Logo";
import styles from "./ContactFooter.module.css";

/** The site footer. `cta` adds the closing call to book a briefing; the contact page leaves it off. */
export function ContactFooter({ cta = true }: { cta?: boolean }) {
  return (
    <footer id="contact" className={styles.wrap}>
      <div className={`${styles.panel} ${cta ? "" : styles.bare}`}>
        {cta && (
          <div className={styles.contact}>
            <h2 className={`display-l ${styles.lines}`}>
              Tell us what you need to defend.
            </h2>
            <ArrowButton href="/contact" tone="light" live>
              Contact us
            </ArrowButton>
          </div>
        )}

        <div className={styles.footer}>
          <div className={styles.columns}>
            <div className={styles.brand}>
              <Logo tone="white" size={64} />
            </div>
            <div className={styles.col}>
              <p className={`label ${styles.head}`}>Products</p>
              {products.map((p) => (
                <Link key={p.slug} href={`/${p.slug}`}>
                  {p.name}
                </Link>
              ))}
            </div>
            <div className={styles.col}>
              <p className={`label ${styles.head}`}>Company</p>
              <Link href="/#careers">Careers</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className={`${styles.col} ${styles.contactCol}`}>
              <p className={`label ${styles.head}`}>Contact</p>
              <span className={styles.muted}>{contact.phone.label}</span>
              <a href={contact.phone.href}>{contact.phone.display}</a>
              <a href={`mailto:${contact.email}`} className={styles.nowrap}>
                {contact.email}
              </a>
            </div>
            <div className={styles.col}>
              <p className={`label ${styles.head}`}>Location</p>
              <span>{contact.location}</span>
            </div>
          </div>
          <div className={styles.legal}>
            <span className="label">© {new Date().getFullYear()} FTI. All rights reserved.</span>
            <div className={styles.legalLinks}>
              {/* Links appear once they lead somewhere: no placeholder hrefs ship. */}
              {contact.linkedin !== "#" && (
                <a className="label" href={contact.linkedin}>
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

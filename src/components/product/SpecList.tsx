"use client";

import { useState } from "react";
import styles from "./ProductSections.module.css";

/** How many spec rows a phone shows before "All specifications". */
const SHORT = 4;

/**
 * The spec sheet's rows. On wide screens every row shows; on phones only the
 * first few, with a control to open the rest, so the section stays short.
 */
export function SpecList({ specs }: { specs: { label: string; value: React.ReactNode }[] }) {
  const [open, setOpen] = useState(false);
  const more = specs.length - SHORT;
  return (
    <>
      <dl id="spec-rows" className={styles.specList} data-collapsed={open ? undefined : ""}>
        {specs.map((s) => (
          <div key={s.label} className={styles.specRow}>
            <dt className="label">{s.label}</dt>
            <dd className="label">{s.value}</dd>
          </div>
        ))}
      </dl>
      {more > 0 && (
        <button type="button" className={`label ${styles.specMore}`} aria-expanded={open} aria-controls="spec-rows" onClick={() => setOpen((o) => !o)}>
          {open ? "Show fewer" : `All ${specs.length} specifications`}
        </button>
      )}
    </>
  );
}

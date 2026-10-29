"use client";

import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/icons";
import button from "@/components/ui/ArrowButton.module.css";
import styles from "./Launch.module.css";

/**
 * The invitation-code form. The proxy shows the gate in place of the page, so
 * the address still carries any code that was tried (?invite=…); one that is
 * there means it did not match. Read in the browser so the gate stays static.
 */
export function GateForm() {
  const tried = useSearchParams().has("invite");
  return <GateFields tried={tried} />;
}

export function GateFields({ tried = false }: { tried?: boolean }) {
  return (
    <>
      <form action="/lunch-and-launch" method="get" className={styles.gateForm}>
        <label htmlFor="invite" className="sr-only">
          Invitation code
        </label>
        <input
          id="invite"
          name="invite"
          className={styles.gateInput}
          placeholder="Invitation code"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          required
          aria-invalid={tried || undefined}
          aria-describedby={tried ? "invite-error" : undefined}
        />
        <button type="submit" className={`${button.button} ${button.dark}`}>
          <span>Open</span>
          <span className={button.chip}>
            <Icon name="arrow" size={14} />
          </span>
        </button>
      </form>
      {tried && (
        <p id="invite-error" className={styles.gateError}>
          That code didn&apos;t match an invitation. Check it and try again, or ask us for a new one.
        </p>
      )}
    </>
  );
}

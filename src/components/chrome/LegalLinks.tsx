import { contact, legal } from "@/content/site";

/** Privacy Policy and Terms of Use. LinkedIn appears only once it is a real URL. */
export function LegalLinks({ className }: { className?: string }) {
  return (
    <div className={className}>
      <a className="label" href={legal.privacy}>
        Privacy Policy
      </a>
      <a className="label" href={legal.terms}>
        Terms of Use
      </a>
      {contact.linkedin !== "#" && (
        <a className="label" href={contact.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      )}
    </div>
  );
}

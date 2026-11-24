import { legal } from "@/content/site";

/** Privacy Policy and Terms of Use. Social profiles sit with Location in the site footer. */
export function LegalLinks({ className }: { className?: string }) {
  return (
    <div className={className}>
      <a className="label" href={legal.privacy}>
        Privacy Policy
      </a>
      <a className="label" href={legal.terms}>
        Terms of Use
      </a>
    </div>
  );
}

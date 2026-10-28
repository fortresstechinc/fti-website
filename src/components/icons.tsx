import type { IconName } from "@/content/products";

const paths: Record<IconName | "arrow" | "download" | "close" | "menu", React.ReactNode> = {
  fuse: (
    <>
      <circle cx="7" cy="10" r="5" />
      <circle cx="13" cy="10" r="5" />
    </>
  ),
  bars: (
    <>
      <path d="M3 17v-5M10 17V8M17 17V3" strokeWidth="2.4" />
    </>
  ),
  screen: (
    <>
      <rect x="2" y="3.5" width="16" height="13" rx="2" />
      <path d="M10 7l3 3-3 3-3-3z" />
    </>
  ),
  mic: (
    <>
      <rect x="7" y="2" width="6" height="10" rx="3" />
      <path d="M4 9.5a6 6 0 0012 0M10 15.5V18" />
    </>
  ),
  shield: (
    <>
      <path d="M10 2l6.5 2.6v5.2c0 3.7-2.7 6.4-6.5 8-3.8-1.6-6.5-4.3-6.5-8V4.6z" />
      <path d="M7.2 10l2 2 3.6-4.2" />
    </>
  ),
  doc: (
    <>
      <rect x="4" y="2" width="12" height="16" rx="1.5" />
      <path d="M7 6.5h6M7 10h6M7 13.5h4" />
    </>
  ),
  target: (
    <>
      <circle cx="10" cy="10" r="8" />
      <circle cx="10" cy="10" r="4.2" />
      <circle cx="10" cy="10" r="1.2" fill="currentColor" />
    </>
  ),
  plug: (
    <>
      <rect x="2" y="6" width="16" height="8" rx="1" />
      <path d="M5.5 10h9M10 6V2.5M10 17.5V14" />
    </>
  ),
  hex: (
    <>
      <path d="M10 2l7.5 4.2v7.6L10 18l-7.5-4.2V6.2z" />
      <circle cx="10" cy="10" r="1.8" fill="currentColor" />
    </>
  ),
  signal: (
    <>
      <path d="M2.5 11a7.5 7.5 0 0115 0M6 11a4 4 0 018 0" />
      <circle cx="10" cy="11" r="1.4" fill="currentColor" />
      <path d="M2.5 15.5h15" />
    </>
  ),
  clock: (
    <>
      <circle cx="10" cy="10" r="8" />
      <path d="M10 5.5V10l3 2" />
    </>
  ),
  spark: (
    <>
      <path d="M10 2v5M10 13v5M2 10h5M13 10h5M4.6 4.6l2.8 2.8M12.6 12.6l2.8 2.8M15.4 4.6l-2.8 2.8M7.4 12.6l-2.8 2.8" />
    </>
  ),
  arrow: <path d="M3 10h13M11 5l5 5-5 5" />,
  download: <path d="M10 3v10M5.5 8.5L10 13l4.5-4.5M3.5 17h13" />,
  close: <path d="M5 5l10 10M15 5L5 15" />,
  menu: <path d="M3 6h14M3 10h14M3 14h14" />,
};

export type AnyIcon = keyof typeof paths;

export function Icon({ name, size = 20, className }: { name: AnyIcon; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}

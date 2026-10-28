import Image from "next/image";
import Link from "next/link";

export function Logo({ tone, size = 44 }: { tone: "white" | "black"; size?: number }) {
  return (
    <Link href="/" aria-label="FTI home" style={{ display: "inline-flex" }}>
      <Image
        src={`/brand/fti-${tone}.png`}
        alt="FTI"
        width={Math.round(size * 1.18)}
        height={size}
        priority
        style={{ width: Math.round(size * 1.18), height: size, objectFit: "contain" }}
      />
    </Link>
  );
}

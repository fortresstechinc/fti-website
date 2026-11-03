import { NextResponse, type NextRequest } from "next/server";

/**
 * Launch and Lunch is by invitation. An invite link carries its code
 * (/launchlunch?invite=CODE): a valid code is kept in a cookie and the
 * address cleaned, so later visits and the booking page (/invitation) just
 * work. Without a valid code the visitor sees the invitation-only page instead.
 *
 * Codes come from LUNCH_AND_LAUNCH_CODES, comma-separated (the variable keeps
 * the name it was first set under in the host's settings). Removing a code
 * shuts out everyone who entered with it. With no codes set, nobody gets in.
 */
const COOKIE = "fti-invite";
const NOINDEX = "noindex, nofollow";

const validCodes = () =>
  (process.env.LUNCH_AND_LAUNCH_CODES ?? "")
    .split(",")
    .map((c) => c.trim().toLowerCase())
    .filter(Boolean);

/** Shows the gate in place of the page; the address (and any code tried) stays as it was. */
function gate(request: NextRequest) {
  const res = NextResponse.rewrite(new URL("/invitation-only", request.url));
  res.headers.set("X-Robots-Tag", NOINDEX);
  return res;
}

export function proxy(request: NextRequest) {
  const codes = validCodes();
  const offered = request.nextUrl.searchParams.get("invite");

  if (offered !== null) {
    const code = offered.trim().toLowerCase();
    if (!codes.includes(code)) return gate(request);
    const clean = request.nextUrl.clone();
    clean.searchParams.delete("invite");
    const res = NextResponse.redirect(clean);
    res.cookies.set(COOKIE, code, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      // Both gated pages (the invitation and its booking page) read it.
      path: "/",
      maxAge: 60 * 60 * 24 * 90,
    });
    return res;
  }

  const held = request.cookies.get(COOKIE)?.value;
  if (!held || !codes.includes(held)) return gate(request);
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", NOINDEX);
  return res;
}

export const config = {
  matcher: ["/launchlunch", "/invitation"],
};

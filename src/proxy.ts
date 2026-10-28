import { NextResponse, type NextRequest } from "next/server";

/**
 * Lunch and Launch is by invitation. An invite link carries its code
 * (/lunch-and-launch?invite=CODE): a valid code is kept in a cookie and the
 * address cleaned, so later visits and the booking page just work. Without a
 * valid code the visitor sees the invitation-only page instead.
 *
 * Codes come from LUNCH_AND_LAUNCH_CODES, comma-separated. Removing a code
 * shuts out everyone who entered with it. With no codes set, nobody gets in.
 */
const COOKIE = "fti-invite";
const NOINDEX = "noindex, nofollow";

const validCodes = () =>
  (process.env.LUNCH_AND_LAUNCH_CODES ?? "")
    .split(",")
    .map((c) => c.trim().toLowerCase())
    .filter(Boolean);

function gate(request: NextRequest, tried: boolean) {
  const to = new URL("/invitation-only", request.url);
  if (tried) to.searchParams.set("tried", "1");
  const res = NextResponse.rewrite(to);
  res.headers.set("X-Robots-Tag", NOINDEX);
  return res;
}

export function proxy(request: NextRequest) {
  const codes = validCodes();
  const offered = request.nextUrl.searchParams.get("invite");

  if (offered !== null) {
    const code = offered.trim().toLowerCase();
    if (!codes.includes(code)) return gate(request, true);
    const clean = request.nextUrl.clone();
    clean.searchParams.delete("invite");
    const res = NextResponse.redirect(clean);
    res.cookies.set(COOKIE, code, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/lunch-and-launch",
      maxAge: 60 * 60 * 24 * 90,
    });
    return res;
  }

  const held = request.cookies.get(COOKIE)?.value;
  if (!held || !codes.includes(held)) return gate(request, false);
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", NOINDEX);
  return res;
}

export const config = {
  matcher: "/lunch-and-launch/:path*",
};

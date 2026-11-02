import type { NextRequest } from "next/server";

/**
 * The visitor's approximate location, for the What we defend map. Vercel adds
 * city-level coordinates to every request from the visitor's IP address; nothing
 * is looked up elsewhere and nothing is stored. Without them (local development,
 * or a request Vercel cannot place) the map shows an example site instead.
 */
export async function GET(request: NextRequest) {
  const h = request.headers;
  const lat = Number(h.get("x-vercel-ip-latitude"));
  const lon = Number(h.get("x-vercel-ip-longitude"));
  const located = h.has("x-vercel-ip-latitude") && h.has("x-vercel-ip-longitude") && Number.isFinite(lat) && Number.isFinite(lon);
  const noStore = { headers: { "Cache-Control": "private, no-store" } };
  if (!located) return Response.json({ found: false }, noStore);

  // City names arrive URL-encoded. In the US the region is the state; elsewhere, the country.
  const city = decodeURIComponent(h.get("x-vercel-ip-city") ?? "");
  const country = h.get("x-vercel-ip-country") ?? "";
  const region = country === "US" ? h.get("x-vercel-ip-country-region") ?? "" : country;
  const place = [city, region].filter(Boolean).join(", ");
  // Two decimals is about a kilometre: as precise as the ring map needs.
  const round = (v: number) => Math.round(v * 100) / 100;
  return Response.json({ found: true, lat: round(lat), lon: round(lon), place }, noStore);
}

/**
 * The visitor's approximate location, for the home page's What we defend map.
 * Netlify places each request by IP at its edge; nothing is looked up
 * elsewhere and nothing is stored. Without a location (or in local `next dev`,
 * where this does not run and the request 404s) the map shows an example site.
 */

// The parts of Netlify's edge context this uses, so no extra package is needed.
type Geo = {
  city?: string;
  country?: { code?: string; name?: string };
  subdivision?: { code?: string; name?: string };
  latitude?: number;
  longitude?: number;
};

export default function where(_request: Request, context: { geo?: Geo }) {
  const geo = context.geo ?? {};
  const noStore = { headers: { "Cache-Control": "private, no-store" } };
  const { latitude: lat, longitude: lon } = geo;
  if (typeof lat !== "number" || typeof lon !== "number" || !Number.isFinite(lat) || !Number.isFinite(lon)) {
    return Response.json({ found: false }, noStore);
  }
  // In the US the region is the state; elsewhere, the country.
  const country = geo.country?.code ?? "";
  const region = country === "US" ? geo.subdivision?.code ?? "" : country;
  const place = [geo.city ?? "", region].filter(Boolean).join(", ");
  // Two decimals is about a kilometre: as precise as the ring map needs.
  const round = (v: number) => Math.round(v * 100) / 100;
  return Response.json({ found: true, lat: round(lat), lon: round(lon), place }, noStore);
}

export const config = { path: "/api/where" };

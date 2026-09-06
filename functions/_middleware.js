/**
 * Cloudflare Pages Function — echter, serverseitiger Zugriffsschutz (Edge, nicht umgehbar).
 * Ersetzt den unsicheren JS-Gate: der Seiteninhalt wird erst NACH erfolgreicher
 * Authentifizierung ausgeliefert.
 *
 * Steuerung über Environment-Variablen (Cloudflare Dashboard → Pages → Settings → Environment variables):
 *   SITE_PUBLIC   = "true"   → Seite ist öffentlich & indexierbar (Go-Live-Schalter)
 *                   sonst    → Seite ist per Passwort geschützt + noindex
 *   SITE_PASSWORD = "…"      → das gemeinsame Zugangspasswort (nur im Gated-Modus nötig)
 *
 * Go-Live = SITE_PUBLIC auf "true" setzen (ein Schalter). Zusätzlich robots.txt + <meta robots>
 * gemäss DEPLOYMENT.md auf "index" stellen.
 */
export async function onRequest(context) {
  const { request, env, next } = context;
  const isPublic = env.SITE_PUBLIC === 'true';

  if (isPublic) {
    return next(); // öffentlich: keine Auth, keine noindex-Header
  }

  // Gated-Modus: HTTP Basic Auth erzwingen
  const expected = env.SITE_PASSWORD || '';
  const header = request.headers.get('Authorization') || '';
  const [scheme, encoded] = header.split(' ');

  let authorized = false;
  if (expected && scheme === 'Basic' && encoded) {
    let decoded = '';
    try { decoded = atob(encoded); } catch (e) { decoded = ''; }
    const pass = decoded.slice(decoded.indexOf(':') + 1); // Benutzername egal
    authorized = timingSafeEqual(pass, expected);
  }

  if (!authorized) {
    return new Response('Kuroiwa Real Estate — geschützter Bereich.', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Kuroiwa — geschuetzter Bereich", charset="UTF-8"',
        'X-Robots-Tag': 'noindex, nofollow',
        'Cache-Control': 'no-store',
        'Content-Type': 'text/plain; charset=utf-8'
      }
    });
  }

  // Authentifiziert: Inhalt ausliefern, aber im Gated-Modus nie indexieren lassen
  const response = await next();
  const out = new Response(response.body, response);
  out.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return out;
}

// Konstantzeit-Vergleich gegen Timing-Angriffe
function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

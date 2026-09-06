# Deployment, Security & Go-Live

Diese Site wird für **Cloudflare Pages** vorbereitet (gratis, git-verbunden). Nur dort greifen
echter Passwortschutz (`functions/_middleware.js`) und die Security-Header (`_headers`).
GitHub Pages kann beides **nicht** und bleibt nur als Vorschau/Fallback.

## Einmalige Einrichtung (Cloudflare Pages)

1. Cloudflare-Konto → **Workers & Pages → Create → Pages → Connect to Git**.
2. Repo `kaito-blip/Kuroiwa-Real-Estate-AG` wählen, Branch `main`.
   Build command: *(leer)*, Output directory: `/` (statische Site).
3. **Settings → Environment variables** setzen:
   - `SITE_PASSWORD` = *dein gewünschtes Zugangspasswort* (nur Gated-Modus)
   - `SITE_PUBLIC` = *nicht setzen* (bzw. `false`) → Seite bleibt geschützt
4. **Custom domains** → `kuroiwa.ch` (und `www`) hinzufügen; Cloudflare legt die DNS-Records
   automatisch an. Damit entfällt der aktuelle Forward auf kwicapital.ch.

Danach ist die Seite hinter echtem, serverseitigem Basic-Auth (nicht über den Quelltext umgehbar).

## Der Go-Live-Schalter (gated ↔ öffentlich)

**Geschützt → Öffentlich (indexierbar):**
1. Cloudflare → Env-Var **`SITE_PUBLIC = true`** setzen → Auth entfällt, `X-Robots-Tag: noindex` entfällt.
2. `robots.txt`: `Disallow: /` → `Allow: /` (Block unten ist vorbereitet, nur umkommentieren).
3. In allen 4 Sprachversionen das `<meta name="robots" content="noindex, nofollow">` auf
   `index, follow` stellen (je eine Zeile, mit `<!-- GO-LIVE -->` markiert):
   `index.html`, `en/index.html`, `fr/index.html`, `it/index.html`.
   Schnellweg: `grep -rl 'noindex, nofollow' *.html */index.html` und ersetzen.
4. Sitemap in der Google Search Console einreichen (enthält alle 4 Sprachversionen
   inkl. hreflang-Alternates) + Google Business Profile anlegen/verknüpfen.

**Öffentlich → wieder geschützt:** Schritte umkehren (`SITE_PUBLIC` löschen/`false`, robots/meta zurück).

> Hinweis: Ein echter „Ein-Klick" ist auf statischem Hosting nicht möglich; Schritt 1
> (Cloudflare-Env) ist der Hauptschalter für **Zugriff + Indexierung**, Schritte 2–3 sind
> zwei klar markierte Zeilen für die HTML-seitige Sauberkeit.

## Sicherheits-Notizen

- `functions/_middleware.js` erzwingt Basic-Auth am Edge und setzt im Gated-Modus `X-Robots-Tag: noindex`.
- `_headers` liefert CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` etc.
- Der bisherige JS-„Tor"-Overlay (Code im Quelltext) ist **keine** Sicherheit und wird nach der
  Cloudflare-Migration überflüssig — er kann dann aus den HTML-Dateien entfernt werden
  (verhindert einen doppelten Login-Prompt).
- CSP nutzt vorerst `'unsafe-inline'` für Skripte; nach dem Auslagern des Inline-JS in
  `assets/app.js` auf Hash/Nonce verschärfen.

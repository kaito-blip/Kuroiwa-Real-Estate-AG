# Integrationen — Klick-für-Klick (Stand 06.09.2026)

Alles auf der Website ist **fertig verdrahtet** — es fehlen nur noch IDs/URLs aus deinen Konten.
Reihenfolge = empfohlene Reihenfolge. Recherche-Basis: Google/Clarity/Apps-Script-Primärquellen (Deep-Research 06.09.26).

---

## 1. Lead-Pipeline + täglicher KPI-Report (Google Apps Script) ⭐ zuerst

**Warum so:** Formspree free = nur 50 Leads/Monat + 30 Tage Historie. Dein Google Workspace:
1'500 Mails/Tag, permanentes Lead-Log, Auto-Antwort, gratis — und derselbe Script schickt
den täglichen KPI-Report um 07:00.

1. [script.google.com](https://script.google.com) → **Neues Projekt** → Inhalt von `apps-script/Code.gs` einfügen.
2. Links **Dienste (+)** → **AnalyticsData** hinzufügen (für den KPI-Report; geht auch später).
3. Projekt-Einstellungen → Zeitzone **Europe/Zurich**.
4. Funktion **`setup()`** einmal ausführen → Berechtigungen bestätigen → erstellt Spreadsheet
   «Kuroiwa Leads» + täglichen Trigger 07:00.
5. **Bereitstellen → Neue Bereitstellung → Web-App** · Ausführen als: **Ich** · Zugriff: **Jeder**
   → die **/exec-URL kopieren**.
6. URL in `assets/app.js` bei `LEAD_ENDPOINT` eintragen (eine Stelle, gilt für alle 4 Sprachen) → push.

**Ergebnis:** Formular-Lead → sofort Mail an kaito@kuroiwa.ch (Reply-To = Interessent) +
Auto-Bestätigung an den Interessenten (in seiner Sprache) + Zeile im Sheet-CRM.
**Täglich 07:00:** KPI-Mail mit Leads, Sessions/Nutzern, Engagement-Rate, Tool-Interaktionen, Top-Quellen.

## 2. GA4 (Google Analytics)

1. [analytics.google.com](https://analytics.google.com) → Property «Kuroiwa Real Estate» (Zeitzone CH, CHF) → Datenstream Web `kuroiwa.ch` → **Mess-ID `G-…`** kopieren.
2. In `assets/monitoring.js`: `ga4.id` eintragen + `ga4.enabled: true` → push.
3. Nach den ersten Events: **Verwaltung → Datenanzeige → Ereignisse** → bei `generate_lead`,
   `wert_indikation`, `whatsapp_click`, `kontakt_click` den Schalter **«Als Key-Event markieren»**.
4. **Property-ID** (Zahl, Verwaltung → Property-Details) in `apps-script/Code.gs` → `GA4_PROPERTY_ID` → Report zeigt ab dann alle Zahlen.

Bereits eingebaut: Consent-gated Laden (revDSG), Consent Mode v2-Signale, Event-Taxonomie
(`generate_lead` = Googles empfohlener Lead-Event; Rechner/Quiz/Klicks als Engagement-Events).

## 3. Google Ads (kein Code nötig)

1. GA4 → **Verwaltung → Produktverknüpfungen → Google Ads** → Konto verknüpfen.
2. In Google Ads: **Auto-Tagging AN** (Einstellungen des Kontos).
3. Ads → **Ziele → Conversions → Importieren → GA4-Key-Events** (v. a. `generate_lead`).

⚠️ **Erwartung (verifiziert):** Da unsere Tags erst nach Opt-in laden («Basic Consent Mode»),
fehlen alle Nicht-Einwilliger komplett; Modeling greift bei dieser Grösse nicht (Schwellen:
~1'000 denied Events/Tag bzw. 700 Ad-Klicks/7 Tage). Gemessene Conversion-Raten sind dadurch
**überzeichnet** (Einwilliger konvertieren laut Google 2–5×  öfter). Für Kampagnen-Steuerung ok —
absolute Zahlen konservativ lesen.

## 4. Microsoft Clarity (Heatmaps + Recordings)

1. [clarity.microsoft.com](https://clarity.microsoft.com) → neues Projekt, URL `kuroiwa.ch` → **Projekt-ID** (10 Zeichen) kopieren.
2. `assets/monitoring.js`: `clarity.id` + `clarity.enabled: true` → push.
Custom-Events (Rechner, Quiz …) laufen automatisch mit → filterbare Recordings.

## 5. Sentry (Fehler-Monitoring)

1. [sentry.io](https://sentry.io) → Projekt «javascript» (EU-Region wählen!) → **DSN** kopieren.
2. `assets/monitoring.js`: `sentry.dsn` eintragen → push. (Läuft ohne Consent — berechtigtes Interesse, ist in der Datenschutzerklärung abgedeckt.)

## 6. Später sinnvoll (nach Go-Live / Ende Non-Compete)

- **Google Search Console** (Property kuroiwa.ch — TXT-Verifizierung liegt schon im DNS ✓) — erst nützlich ohne noindex.
- **UptimeRobot** (gratis): Monitor auf https://kuroiwa.ch → Mail bei Ausfall.
- **Looker Studio**: hübsches Dashboard auf GA4 (1 Zeitplan/Report, max. täglich) — Ergänzung zum KPI-Mail.
- **Google Business Profile** — für lokale Suche, erst bei öffentlicher Seite.
- DMARC von `p=none` → `p=quarantine` (nach ein paar Wochen sauberem Mailversand).

---

### Was du mir schicken kannst, dann trage ich ein (je ~2 Min)
| Was | Format | Landet in |
|---|---|---|
| Apps-Script /exec-URL | `https://script.google.com/macros/s/…/exec` | `assets/app.js` |
| GA4 Mess-ID | `G-XXXXXXXXXX` | `assets/monitoring.js` |
| GA4 Property-ID | Zahl | `apps-script/Code.gs` (trägst du selbst ein) |
| Clarity Projekt-ID | 10 Zeichen | `assets/monitoring.js` |
| Sentry DSN | `https://…ingest…sentry.io/…` | `assets/monitoring.js` |

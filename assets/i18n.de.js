/* Kuroiwa i18n — Deutsch (de-CH). Gleiche Struktur wie i18n.en/fr/it.js:
   nur String-Literale übersetzen, Schlüssel & Funktions-Signaturen niemals ändern. */
window.KURO_T = {
  ortszeit: 'Ortszeit',

  // Lead-Formular
  leadPlatzhalter: 'Formular noch nicht scharfgeschaltet — Apps-Script-URL in assets/app.js eintragen.',
  leadSenden: 'Wird gesendet …',
  leadFehler: 'Senden fehlgeschlagen — bitte direkt an kaito@kuroiwa.ch.',
  leadNetz: 'Netzwerkfehler — bitte direkt an kaito@kuroiwa.ch.',

  // Anzeige-Namen (Logik nutzt Slugs, Texte kommen von hier)
  region: { luzern: 'Luzern', aargau: 'Aargau', stgallen: 'St. Gallen', uebrige: 'Übrige Schweiz' },
  nutzungW: { wohnen: 'Wohnen', wg: 'Wohnen und Gewerbe', buero: 'Büro', gewerbe: 'Gewerbe' },
  zustand: { saniert: 'saniert/neuwertig', gepflegt: 'gepflegt', sanierungsbedarf: 'mit Sanierungsbedarf' },
  nutzungG: { retail: 'Retail', buero: 'Büro', gastro: 'Gastronomie', lager: 'Lager / Fachmarkt' },
  lage: { lage1a: '1A-Lage', lage1b: '1B-Lage', quartier: 'Quartier / Agglomeration' },
  stock: { eg: 'Erdgeschoss', og: 'Obergeschoss', ug: 'Untergeschoss' },
  checkKanton: { luzern: 'Luzern', aargau: 'Aargau', stgallen: 'St. Gallen', anderer: 'anderer Kanton' },
  checkObjekt: { wohnung: 'Wohnung / Studio', mfh: 'Mehrfamilienhaus', wgh: 'Wohn- und Geschäftshaus', gewerbe: 'Gewerbe' },
  checkPreis: { bis1: 'bis CHF 1 Mio.', m12: 'CHF 1–2 Mio.', ueber2: 'über CHF 2 Mio.' },

  // Ankaufs-Check
  checkUeber2: 'Für den Direkterwerb liegt das über unserem Profil — aber es ist ein starker Fall für ein Vermittlungsmandat: Wir bringen Ihre Liegenschaft diskret zu geprüften Käufern.',
  checkAnderer: 'Ausserhalb unseres Kernraums Luzern, Aargau und St. Gallen — ausgewählte Lagen wie Kreuzlingen oder Bulle/Freiburg prüfen wir dennoch, und für Verkauf und Vermittlung sind wir schweizweit tätig. Sprechen wir darüber.',
  checkGewerbe: 'Reine Gewerbeobjekte prüfen wir im Einzelfall — an zentralen 1A-Lagen sind wir sehr interessiert. Senden Sie uns die Eckdaten.',
  checkPasst: 'Ihre Liegenschaft passt in unser Ankaufsprofil. Wir prüfen innert weniger Tage und unterbreiten Ihnen eine verbindliche Einschätzung — ohne Ausschreibung, ohne Bieterverfahren.',
  checkMsg: function (objekt, kanton, preis) {
    return 'Guten Tag%0A%0AObjekt: ' + encodeURIComponent(objekt) + '%0AKanton: ' + encodeURIComponent(kanton) + '%0APreisvorstellung: ' + encodeURIComponent(preis) + '%0A%0AIch wünsche eine Einschätzung von Kuroiwa.';
  },
  checkMailSubject: 'Liegenschaft anbieten — Ankaufs-Check',

  // Wert-Indikation
  wertZahlMio: function (tief, hoch) { return 'CHF ' + tief + ' – <b>' + hoch + ' Mio.</b>'; },
  wertZahlChf: function (tief, hoch) { return 'CHF ' + tief + ' – <b>' + hoch + '</b>'; },
  wertSub: function (rMin, rMax, nutzung, region, zustand) {
    return 'Basis: Bruttorendite ' + rMin + ' – ' + rMax + ' % für ' + nutzung + ', Region ' + region + ', ' + zustand + '.';
  },
  wertMsg: function (nutzung, region, zustand, ertrag, tief, hoch) {
    return 'Wert-Indikation von kuroiwa.ch:%0A%0ANutzung: ' + encodeURIComponent(nutzung) + '%0ARegion: ' + encodeURIComponent(region) + '%0AZustand: ' + encodeURIComponent(zustand) + '%0ANetto-Mietertrag: CHF ' + encodeURIComponent(ertrag) + '/Jahr%0AIndikation: CHF ' + encodeURIComponent(tief) + ' – ' + encodeURIComponent(hoch) + ' Mio.%0A%0AIch wünsche eine verbindliche Einschätzung.';
  },
  wertMailSubject: 'Verbindliche Einschätzung — Wert-Indikation',

  // Miet-Indikation
  mietZahl: function (mMin, mMax) { return 'CHF ' + mMin + ' – <b>' + mMax + ' /m²·Jahr</b>'; },
  mietSub: function (flaeche, nutzung, lage, stock, kanton, jahrMin, jahrMax, monMin, monMax) {
    return 'Bei ' + flaeche + ' m² (' + nutzung + ', ' + lage + ', ' + stock + ', Kanton ' + kanton + '): CHF ' + jahrMin + ' – ' + jahrMax + ' pro Jahr, entsprechend CHF ' + monMin + ' – ' + monMax + ' pro Monat netto.';
  },
  mietMsg: function (nutzung, kanton, lage, stock, flaeche, mMin, mMax, jahrMin, jahrMax) {
    return 'Miet-Indikation von kuroiwa.ch:%0A%0ANutzung: ' + encodeURIComponent(nutzung) + '%0AKanton: ' + encodeURIComponent(kanton) + '%0ALage: ' + encodeURIComponent(lage) + '%0AStockwerk: ' + encodeURIComponent(stock) + '%0AFläche: ' + encodeURIComponent(flaeche) + ' m²%0AIndikation: CHF ' + mMin + '–' + mMax + '/m²/Jahr (CHF ' + encodeURIComponent(jahrMin) + '–' + encodeURIComponent(jahrMax) + '/Jahr)%0A%0AIch wünsche einen konkreten Mietvorschlag.';
  },
  mietMailSubject: 'Mietvorschlag — Gewerbefläche',

  // Markt-Instinkt-Quiz (numerische Konfiguration bleibt in app.js)
  quiz: [
    { f: 'Was kostet ein m² Retail-Fläche an einer Schweizer 1A-Lage pro Jahr (netto, im Mittel)?', quelle: 'Marktübliche Bandbreite: CHF 400–900 pro m² und Jahr — Toplagen in Zürich oder Genf liegen deutlich darüber.' },
    { f: 'Wie viel Prozent der Schweizer Haushalte wohnen zur Miete?', quelle: 'Rund 58 Prozent — die höchste Mieterquote Europas. Genau darum sind Renditeliegenschaften hier so gefragt.' },
    { f: 'Wie hoch ist die Leerwohnungsziffer der Schweiz ungefähr?', quelle: 'Rund 1 Prozent und sinkend — in den Zentren praktisch Vollvermietung.' },
    { f: 'Welche Bruttorendite ist für ein gepflegtes Mehrfamilienhaus in der Region Luzern realistisch?', quelle: 'Unsere Praxis: 3.6–4.4 Prozent, je nach Mikrolage und Zustand.' },
    { f: 'Um wie viel Prozent liegt ein Ladenlokal im Obergeschoss typischerweise unter der Erdgeschoss-Miete?', quelle: 'Rund 40–50 Prozent — Frequenz ist im Retail fast alles.' }
  ],
  quizNr: function (i, n) { return 'Frage ' + i + ' / ' + n; },
  quizPruefen: 'Antwort prüfen',
  quizNaechste: 'Nächste Frage',
  quizErgebnis: 'Ergebnis anzeigen',
  quizPunkte: function (wert, punkte) { return 'Richtig wäre: <b>' + wert + '</b> — Sie erhalten <b>' + punkte + ' / 20</b> Punkten.'; },
  quizTitel: function (p) {
    return p >= 75 ? p + ' / 100 — <b>Insider.</b>' : p >= 45 ? p + ' / 100 — <b>Marktkenner.</b>' : p + ' / 100 — <b>Beobachter.</b>';
  },
  quizFazit: function (p) {
    return p >= 75 ? 'Sie denken wie wir. Umso mehr lohnt sich ein Gespräch unter Kennern — über das, was der Markt nicht sieht.'
         : p >= 45 ? 'Solides Gespür. Den Rest — Mikrolage, Frequenz, Off-Market-Preise — liefern wir im Gespräch.'
         : 'Der Markt ist ein Insider-Geschäft. Gut, kennen Sie jetzt jemanden, der drin ist.';
  }
};

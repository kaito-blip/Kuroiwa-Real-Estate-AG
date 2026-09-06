/* Kuroiwa i18n — English (en). Same structure as i18n.de/fr/it.js:
   translate only string literals, never change keys or function signatures. */
window.KURO_T = {
  ortszeit: 'Local time',

  // Lead form
  leadPlatzhalter: 'Form not yet live — please add the Formspree ID in index.html.',
  leadSenden: 'Sending …',
  leadFehler: 'Sending failed — please write directly to kaito@kuroiwa.ch.',
  leadNetz: 'Network error — please write directly to kaito@kuroiwa.ch.',

  // Display names (logic uses slugs, texts come from here)
  region: { luzern: 'Lucerne', aargau: 'Aargau', stgallen: 'St. Gallen', uebrige: 'Rest of Switzerland' },
  nutzungW: { wohnen: 'Residential', wg: 'Residential and commercial', buero: 'Office', gewerbe: 'Commercial' },
  zustand: { saniert: 'renovated/as new', gepflegt: 'well maintained', sanierungsbedarf: 'in need of renovation' },
  nutzungG: { retail: 'Retail', buero: 'Office', gastro: 'Food & Beverage', lager: 'Warehouse / Retail park' },
  lage: { lage1a: 'prime location', lage1b: 'secondary location', quartier: 'neighbourhood / agglomeration' },
  stock: { eg: 'Ground floor', og: 'Upper floor', ug: 'Basement' },
  checkKanton: { luzern: 'Lucerne', aargau: 'Aargau', stgallen: 'St. Gallen', anderer: 'other canton' },
  checkObjekt: { wohnung: 'Apartment / Studio', mfh: 'Apartment building', wgh: 'Residential and commercial building', gewerbe: 'Commercial' },
  checkPreis: { bis1: 'up to CHF 1 million', m12: 'CHF 1–2 million', ueber2: 'over CHF 2 million' },

  // Acquisition check
  checkUeber2: 'For a direct acquisition this lies above our profile — but it makes a strong case for a brokerage mandate: we bring your property discreetly to vetted buyers.',
  checkAnderer: 'Outside our core acquisition area of Lucerne, Aargau and St. Gallen — for sales and brokerage, however, we operate throughout Switzerland. Let us talk about it.',
  checkGewerbe: 'Purely commercial properties are reviewed case by case — in central prime locations we are highly interested. Send us the key facts.',
  checkPasst: 'Your property fits our acquisition profile. We complete our review within days and present you with a binding assessment — no listing, no bidding process.',
  checkMsg: function (objekt, kanton, preis) {
    return 'Good day%0A%0AProperty: ' + encodeURIComponent(objekt) + '%0ACanton: ' + encodeURIComponent(kanton) + '%0APrice expectation: ' + encodeURIComponent(preis) + '%0A%0AI would like an assessment from Kuroiwa.';
  },
  checkMailSubject: 'Offering a property — Acquisition check',

  // Value indication
  wertZahlMio: function (tief, hoch) { return 'CHF ' + tief + ' – <b>' + hoch + ' million</b>'; },
  wertZahlChf: function (tief, hoch) { return 'CHF ' + tief + ' – <b>' + hoch + '</b>'; },
  wertSub: function (rMin, rMax, nutzung, region, zustand) {
    return 'Basis: gross yield of ' + rMin + ' – ' + rMax + ' % for ' + nutzung + ', region ' + region + ', ' + zustand + '.';
  },
  wertMsg: function (nutzung, region, zustand, ertrag, tief, hoch) {
    return 'Value indication from kuroiwa.ch:%0A%0AUse: ' + encodeURIComponent(nutzung) + '%0ARegion: ' + encodeURIComponent(region) + '%0ACondition: ' + encodeURIComponent(zustand) + '%0ANet rental income: CHF ' + encodeURIComponent(ertrag) + '/year%0AIndication: CHF ' + encodeURIComponent(tief) + ' – ' + encodeURIComponent(hoch) + ' million%0A%0AI would like a binding assessment.';
  },
  wertMailSubject: 'Binding assessment — Value indication',

  // Rent indication
  mietZahl: function (mMin, mMax) { return 'CHF ' + mMin + ' – <b>' + mMax + ' /m²·year</b>'; },
  mietSub: function (flaeche, nutzung, lage, stock, kanton, jahrMin, jahrMax, monMin, monMax) {
    return 'For ' + flaeche + ' m² (' + nutzung + ', ' + lage + ', ' + stock + ', canton of ' + kanton + '): CHF ' + jahrMin + ' – ' + jahrMax + ' per year, corresponding to CHF ' + monMin + ' – ' + monMax + ' per month net.';
  },
  mietMsg: function (nutzung, kanton, lage, stock, flaeche, mMin, mMax, jahrMin, jahrMax) {
    return 'Rent indication from kuroiwa.ch:%0A%0AUse: ' + encodeURIComponent(nutzung) + '%0ACanton: ' + encodeURIComponent(kanton) + '%0ALocation: ' + encodeURIComponent(lage) + '%0AFloor: ' + encodeURIComponent(stock) + '%0AArea: ' + encodeURIComponent(flaeche) + ' m²%0AIndication: CHF ' + mMin + '–' + mMax + '/m²/year (CHF ' + encodeURIComponent(jahrMin) + '–' + encodeURIComponent(jahrMax) + '/year)%0A%0AI would like a concrete rent proposal.';
  },
  mietMailSubject: 'Rent proposal — Commercial space',

  // Market-instinct quiz (numeric configuration remains in app.js)
  quiz: [
    { f: 'What does one m² of retail space in a prime Swiss location cost per year (net, on average)?', quelle: 'Customary market range: CHF 400–900 per m² per year — top locations in Zurich or Geneva sit well above that.' },
    { f: 'What percentage of Swiss households rent their home?', quelle: 'Around 58 percent — the highest share of renters in Europe. This is precisely why investment properties are in such demand here.' },
    { f: 'Roughly how high is the vacancy rate for rental housing in Switzerland?', quelle: 'Around 1 percent and falling — in the urban centres, effectively full occupancy.' },
    { f: 'What gross yield is realistic for a well-maintained apartment building in the Lucerne region?', quelle: 'Our practice: 3.6–4.4 percent, depending on micro-location and condition.' },
    { f: 'By what percentage does an upper-floor retail unit typically rent below the ground floor?', quelle: 'Around 40–50 percent — in retail, footfall is almost everything.' }
  ],
  quizNr: function (i, n) { return 'Question ' + i + ' / ' + n; },
  quizPruefen: 'Check answer',
  quizNaechste: 'Next question',
  quizErgebnis: 'Show result',
  quizPunkte: function (wert, punkte) { return 'The correct answer: <b>' + wert + '</b> — you receive <b>' + punkte + ' / 20</b> points.'; },
  quizTitel: function (p) {
    return p >= 75 ? p + ' / 100 — <b>Insider.</b>' : p >= 45 ? p + ' / 100 — <b>Market connoisseur.</b>' : p + ' / 100 — <b>Observer.</b>';
  },
  quizFazit: function (p) {
    return p >= 75 ? 'You think the way we do. All the more reason for a conversation among connoisseurs — about what the market does not see.'
         : p >= 45 ? 'A solid instinct. The rest — micro-location, footfall, off-market prices — we deliver in conversation.'
         : 'This market is an insider business. Fortunate, then, that you now know someone on the inside.';
  }
};

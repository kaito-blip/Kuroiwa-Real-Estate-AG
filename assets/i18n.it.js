/* Kuroiwa i18n — Italiano (it-CH). Stessa struttura di i18n.de/en/fr.js:
   tradurre soltanto le stringhe, non modificare mai chiavi e firme delle funzioni. */
window.KURO_T = {
  ortszeit: 'Ora locale',

  // Modulo di contatto
  leadPlatzhalter: 'Modulo non ancora attivo — inserire l\'URL Apps Script in assets/app.js.',
  leadSenden: 'Invio in corso …',
  leadFehler: 'Invio non riuscito — La preghiamo di scrivere direttamente a kaito@kuroiwa.ch.',
  leadNetz: 'Errore di rete — La preghiamo di scrivere direttamente a kaito@kuroiwa.ch.',

  // Nomi visualizzati (la logica usa gli slug, i testi provengono da qui)
  region: { luzern: 'Lucerna', aargau: 'Argovia', stgallen: 'San Gallo', uebrige: 'resto della Svizzera' },
  nutzungW: { wohnen: 'uso residenziale', wg: 'uso residenziale e commerciale', buero: 'uso ufficio', gewerbe: 'uso commerciale' },
  zustand: { saniert: 'risanato/pari al nuovo', gepflegt: 'ben tenuto', sanierungsbedarf: 'da risanare' },
  nutzungG: { retail: 'retail', buero: 'uffici', gastro: 'ristorazione', lager: 'deposito / mercato specializzato' },
  lage: { lage1a: 'posizione 1A', lage1b: 'posizione 1B', quartier: 'quartiere / agglomerato' },
  stock: { eg: 'piano terra', og: 'piano superiore', ug: 'piano interrato' },
  checkKanton: { luzern: 'Lucerna', aargau: 'Argovia', stgallen: 'San Gallo', anderer: 'altro Cantone' },
  checkObjekt: { wohnung: 'appartamento / monolocale', mfh: 'casa plurifamiliare', wgh: 'immobile residenziale e commerciale', gewerbe: 'commerciale' },
  checkPreis: { bis1: 'fino a CHF 1 mio.', m12: 'CHF 1–2 mio.', ueber2: 'oltre CHF 2 mio.' },

  // Check di acquisto
  checkUeber2: 'Per l\'acquisto diretto supera il nostro profilo — ma è un caso ideale per un mandato di intermediazione: portiamo il Suo immobile, con discrezione, ad acquirenti verificati.',
  checkAnderer: 'Al di fuori del nostro perimetro principale — Lucerna, Argovia e San Gallo — ma esaminiamo anche posizioni selezionate come Kreuzlingen o Bulle/Friburgo, e per vendita e intermediazione operiamo in tutta la Svizzera. Parliamone.',
  checkGewerbe: 'Gli immobili puramente commerciali li valutiamo caso per caso — le posizioni 1A centrali ci interessano molto. Ci invii i dati essenziali.',
  checkPasst: 'Il Suo immobile rientra nel nostro profilo di acquisto. Lo esaminiamo entro pochi giorni e Le sottoponiamo una valutazione vincolante — senza bando, senza procedura d\'asta.',
  checkMsg: function (objekt, kanton, preis) {
    return 'Buongiorno%0A%0AOggetto: ' + encodeURIComponent(objekt) + '%0ACantone: ' + encodeURIComponent(kanton) + '%0APrezzo indicativo: ' + encodeURIComponent(preis) + '%0A%0ADesidero una valutazione da parte di Kuroiwa.';
  },
  checkMailSubject: 'Proposta di immobile — Check di acquisto',

  // Indicazione di valore
  wertZahlMio: function (tief, hoch) { return 'CHF ' + tief + ' – <b>' + hoch + ' mio.</b>'; },
  wertZahlChf: function (tief, hoch) { return 'CHF ' + tief + ' – <b>' + hoch + '</b>'; },
  wertSub: function (rMin, rMax, nutzung, region, zustand) {
    return 'Base: rendimento lordo ' + rMin + ' – ' + rMax + ' % per ' + nutzung + ', regione ' + region + ', ' + zustand + '.';
  },
  wertMsg: function (nutzung, region, zustand, ertrag, tief, hoch) {
    return 'Indicazione di valore da kuroiwa.ch:%0A%0ADestinazione: ' + encodeURIComponent(nutzung) + '%0ARegione: ' + encodeURIComponent(region) + '%0AStato: ' + encodeURIComponent(zustand) + '%0AReddito locativo netto: CHF ' + encodeURIComponent(ertrag) + '/anno%0AIndicazione: CHF ' + encodeURIComponent(tief) + ' – ' + encodeURIComponent(hoch) + ' mio.%0A%0ADesidero una valutazione vincolante.';
  },
  wertMailSubject: 'Valutazione vincolante — Indicazione di valore',

  // Indicazione di canone
  mietZahl: function (mMin, mMax) { return 'CHF ' + mMin + ' – <b>' + mMax + ' /m²·anno</b>'; },
  mietSub: function (flaeche, nutzung, lage, stock, kanton, jahrMin, jahrMax, monMin, monMax) {
    return 'Per ' + flaeche + ' m² (' + nutzung + ', ' + lage + ', ' + stock + ', Cantone ' + kanton + '): CHF ' + jahrMin + ' – ' + jahrMax + ' all\'anno, pari a CHF ' + monMin + ' – ' + monMax + ' al mese netti.';
  },
  mietMsg: function (nutzung, kanton, lage, stock, flaeche, mMin, mMax, jahrMin, jahrMax) {
    return 'Indicazione di canone da kuroiwa.ch:%0A%0ADestinazione: ' + encodeURIComponent(nutzung) + '%0ACantone: ' + encodeURIComponent(kanton) + '%0APosizione: ' + encodeURIComponent(lage) + '%0APiano: ' + encodeURIComponent(stock) + '%0ASuperficie: ' + encodeURIComponent(flaeche) + ' m²%0AIndicazione: CHF ' + mMin + '–' + mMax + '/m²/anno (CHF ' + encodeURIComponent(jahrMin) + '–' + encodeURIComponent(jahrMax) + '/anno)%0A%0ADesidero una proposta di canone concreta.';
  },
  mietMailSubject: 'Proposta di canone — Superficie commerciale',

  // Quiz sull'istinto di mercato (la configurazione numerica resta in app.js)
  quiz: [
    { f: 'Quanto costa all\'anno un m² di superficie retail in una posizione 1A svizzera (netto, in media)?', quelle: 'Fascia di mercato consueta: CHF 400–900 per m² e anno — le posizioni di punta a Zurigo o Ginevra si collocano nettamente al di sopra.' },
    { f: 'Quale percentuale delle economie domestiche svizzere vive in affitto?', quelle: 'Circa il 58 per cento — la quota di inquilini più alta d\'Europa. È proprio per questo che gli immobili a reddito sono qui così ricercati.' },
    { f: 'A quanto ammonta, all\'incirca, il tasso di abitazioni vuote in Svizzera?', quelle: 'Circa l\'1 per cento e in calo — nei centri, di fatto, piena locazione.' },
    { f: 'Quale rendimento lordo è realistico per una casa plurifamiliare ben tenuta nella regione di Lucerna?', quelle: 'La nostra prassi: 3.6–4.4 per cento, a seconda della microposizione e dello stato.' },
    { f: 'Di quanto, in percentuale, il canone di un negozio al piano superiore è tipicamente inferiore a quello del piano terra?', quelle: 'Circa il 40–50 per cento — nel retail la frequenza è quasi tutto.' }
  ],
  quizNr: function (i, n) { return 'Domanda ' + i + ' / ' + n; },
  quizPruefen: 'Verificare la risposta',
  quizNaechste: 'Domanda successiva',
  quizErgebnis: 'Mostrare il risultato',
  quizPunkte: function (wert, punkte) { return 'La risposta corretta sarebbe: <b>' + wert + '</b> — Lei ottiene <b>' + punkte + ' / 20</b> punti.'; },
  quizTitel: function (p) {
    return p >= 75 ? p + ' / 100 — <b>Insider.</b>' : p >= 45 ? p + ' / 100 — <b>Conoscitore del mercato.</b>' : p + ' / 100 — <b>Osservatore.</b>';
  },
  quizFazit: function (p) {
    return p >= 75 ? 'Lei ragiona come noi. A maggior ragione vale la pena parlarsi tra intenditori — di ciò che il mercato non vede.'
         : p >= 45 ? 'Buon intuito. Il resto — microposizione, frequenza, prezzi off-market — glielo forniamo a voce.'
         : 'Il mercato è un affare per insider. Un bene, quindi, che ora Lei conosca qualcuno che ne fa parte.';
  }
};

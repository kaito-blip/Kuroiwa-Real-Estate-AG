/* Kuroiwa i18n — Français (fr-CH). Même structure que i18n.de/en/it.js :
   ne traduire que les littéraux de chaîne, ne jamais modifier les clés ni les signatures de fonctions. */
window.KURO_T = {
  ortszeit: 'Heure locale',

  // Lead-Formular
  leadPlatzhalter: 'Formulaire pas encore activé — veuillez saisir l’ID Formspree dans index.html.',
  leadSenden: 'Envoi en cours …',
  leadFehler: 'Échec de l’envoi — veuillez écrire directement à kaito@kuroiwa.ch.',
  leadNetz: 'Erreur de réseau — veuillez écrire directement à kaito@kuroiwa.ch.',

  // Anzeige-Namen (Logik nutzt Slugs, Texte kommen von hier)
  region: { luzern: 'Lucerne', aargau: 'Argovie', stgallen: 'Saint-Gall', uebrige: 'Reste de la Suisse' },
  nutzungW: { wohnen: 'Habitation', wg: 'Habitation et commerce', buero: 'Bureaux', gewerbe: 'Commerce / artisanat' },
  zustand: { saniert: 'rénové/état neuf', gepflegt: 'entretenu', sanierungsbedarf: 'avec besoin de rénovation' },
  nutzungG: { retail: 'Retail', buero: 'Bureaux', gastro: 'Restauration', lager: 'Dépôt / commerce spécialisé' },
  lage: { lage1a: 'emplacement 1A', lage1b: 'emplacement 1B', quartier: 'quartier / agglomération' },
  stock: { eg: 'rez-de-chaussée', og: 'étage supérieur', ug: 'sous-sol' },
  checkKanton: { luzern: 'Lucerne', aargau: 'Argovie', stgallen: 'Saint-Gall', anderer: 'autre canton' },
  checkObjekt: { wohnung: 'Appartement / studio', mfh: 'Immeuble locatif', wgh: 'Immeuble résidentiel et commercial', gewerbe: 'Objet commercial' },
  checkPreis: { bis1: 'jusqu’à CHF 1 mio.', m12: 'CHF 1–2 mio.', ueber2: 'plus de CHF 2 mio.' },

  // Ankaufs-Check
  checkUeber2: 'Pour une acquisition directe, cela dépasse notre profil — mais c’est un dossier solide pour un mandat de courtage : nous présentons votre bien, en toute discrétion, à des acheteurs vérifiés.',
  checkAnderer: 'Hors de notre périmètre d’acquisition — Lucerne, Argovie et Saint-Gall — mais pour la vente et le courtage, nous sommes actifs dans toute la Suisse. Parlons-en.',
  checkGewerbe: 'Les objets purement commerciaux sont examinés au cas par cas — les emplacements 1A centraux nous intéressent vivement. Envoyez-nous les données clés.',
  checkPasst: 'Votre bien correspond à notre profil d’acquisition. Nous l’examinons en quelques jours et vous soumettons une appréciation ferme — sans mise en vente publique, sans procédure d’enchères.',
  checkMsg: function (objekt, kanton, preis) {
    return 'Bonjour%0A%0AObjet: ' + encodeURIComponent(objekt) + '%0ACanton: ' + encodeURIComponent(kanton) + '%0APrix envisagé: ' + encodeURIComponent(preis) + '%0A%0AJe souhaite une appréciation de Kuroiwa.';
  },
  checkMailSubject: 'Proposer un bien — Check d’acquisition',

  // Wert-Indikation
  wertZahlMio: function (tief, hoch) { return 'CHF ' + tief + ' – <b>' + hoch + ' mio.</b>'; },
  wertZahlChf: function (tief, hoch) { return 'CHF ' + tief + ' – <b>' + hoch + '</b>'; },
  wertSub: function (rMin, rMax, nutzung, region, zustand) {
    return 'Base : rendement brut ' + rMin + ' – ' + rMax + ' % pour ' + nutzung + ', région ' + region + ', ' + zustand + '.';
  },
  wertMsg: function (nutzung, region, zustand, ertrag, tief, hoch) {
    return 'Indication de valeur de kuroiwa.ch:%0A%0AAffectation: ' + encodeURIComponent(nutzung) + '%0ARégion: ' + encodeURIComponent(region) + '%0AÉtat: ' + encodeURIComponent(zustand) + '%0ARevenu locatif net: CHF ' + encodeURIComponent(ertrag) + '/an%0AIndication: CHF ' + encodeURIComponent(tief) + ' – ' + encodeURIComponent(hoch) + ' mio.%0A%0AJe souhaite une appréciation ferme.';
  },
  wertMailSubject: 'Appréciation ferme — Indication de valeur',

  // Miet-Indikation
  mietZahl: function (mMin, mMax) { return 'CHF ' + mMin + ' – <b>' + mMax + ' /m²·an</b>'; },
  mietSub: function (flaeche, nutzung, lage, stock, kanton, jahrMin, jahrMax, monMin, monMax) {
    return 'Pour ' + flaeche + ' m² (' + nutzung + ', ' + lage + ', ' + stock + ', canton ' + kanton + ') : CHF ' + jahrMin + ' – ' + jahrMax + ' par an, soit CHF ' + monMin + ' – ' + monMax + ' par mois net.';
  },
  mietMsg: function (nutzung, kanton, lage, stock, flaeche, mMin, mMax, jahrMin, jahrMax) {
    return 'Indication de loyer de kuroiwa.ch:%0A%0AAffectation: ' + encodeURIComponent(nutzung) + '%0ACanton: ' + encodeURIComponent(kanton) + '%0AEmplacement: ' + encodeURIComponent(lage) + '%0AÉtage: ' + encodeURIComponent(stock) + '%0ASurface: ' + encodeURIComponent(flaeche) + ' m²%0AIndication: CHF ' + mMin + '–' + mMax + '/m²/an (CHF ' + encodeURIComponent(jahrMin) + '–' + encodeURIComponent(jahrMax) + '/an)%0A%0AJe souhaite une proposition de loyer concrète.';
  },
  mietMailSubject: 'Proposition de loyer — Surface commerciale',

  // Markt-Instinkt-Quiz (numerische Konfiguration bleibt in app.js)
  quiz: [
    { f: 'Combien coûte un m² de surface retail à un emplacement 1A suisse par an (net, en moyenne)?', quelle: 'Fourchette usuelle du marché : CHF 400–900 par m² et par an — les meilleurs emplacements de Zurich ou de Genève se situent nettement au-dessus.' },
    { f: 'Quel pourcentage des ménages suisses sont locataires de leur logement?', quelle: 'Environ 58 pour cent — le taux de locataires le plus élevé d’Europe. C’est précisément pourquoi les immeubles de rendement y sont si recherchés.' },
    { f: 'Quel est, approximativement, le taux de logements vacants en Suisse?', quelle: 'Environ 1 pour cent, en baisse — dans les centres, une occupation quasi totale.' },
    { f: 'Quel rendement brut est réaliste pour un immeuble locatif entretenu dans la région de Lucerne?', quelle: 'Notre pratique : 3.6–4.4 pour cent, selon la micro-situation et l’état.' },
    { f: 'De quel pourcentage le loyer d’une arcade à l’étage est-il typiquement inférieur à celui du rez-de-chaussée?', quelle: 'Environ 40–50 pour cent — dans le retail, la fréquentation est presque tout.' }
  ],
  quizNr: function (i, n) { return 'Question ' + i + ' / ' + n; },
  quizPruefen: 'Vérifier la réponse',
  quizNaechste: 'Question suivante',
  quizErgebnis: 'Afficher le résultat',
  quizPunkte: function (wert, punkte) { return 'La bonne réponse : <b>' + wert + '</b> — vous obtenez <b>' + punkte + ' / 20</b> points.'; },
  quizTitel: function (p) {
    return p >= 75 ? p + ' / 100 — <b>Initié.</b>' : p >= 45 ? p + ' / 100 — <b>Connaisseur.</b>' : p + ' / 100 — <b>Observateur.</b>';
  },
  quizFazit: function (p) {
    return p >= 75 ? 'Vous pensez comme nous. Raison de plus pour un entretien entre connaisseurs — sur ce que le marché ne voit pas.'
         : p >= 45 ? 'Un flair solide. Le reste — micro-situation, fréquentation, prix off-market — nous vous l’apportons lors de l’entretien.'
         : 'Le marché est une affaire d’initiés. Heureusement, vous connaissez désormais quelqu’un qui en est.';
  }
};

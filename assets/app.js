document.getElementById('jahr').textContent = new Date().getFullYear();
  const nav = document.getElementById('nav');
  const intro = document.querySelector('.intro');
  const bg = document.querySelector('.intro .bg');

  // Parallax, Intro-Kinetik, Nav-Einblendung, Lese-Fortschritt, Kanji-Parallax
  const fortschritt = document.getElementById('fortschritt');
  const introInhalt = document.querySelector('.intro-inhalt');
  const kanjiWz = document.getElementById('kanjiWz');
  const haltung = document.getElementById('haltung');
  const hoch = document.getElementById('hoch');
  addEventListener('scroll', () => {
    const y = scrollY, ih = intro.offsetHeight;
    nav.classList.toggle('zeig', y > ih * .72);
    hoch.classList.toggle('zeig', y > innerHeight * 1.5);
    if (y < ih) {
      bg.style.transform = `translateY(${y * .32}px) scale(1.02)`;
      const p = y / ih;
      introInhalt.style.opacity = Math.max(0, 1 - p * 1.5);
      introInhalt.style.transform = `translateY(${y * .16}px) scale(${1 - p * .06})`;
    }
    const r = haltung.getBoundingClientRect();
    if (r.bottom > 0 && r.top < innerHeight) kanjiWz.style.transform = `translateY(${(innerHeight - r.top) * -.07}px)`;
    fuelleText();
    stapleKarten();
    fahreSpur();
    fortschritt.style.width = (y / (document.documentElement.scrollHeight - innerHeight) * 100) + '%';
  }, { passive: true });

  // Manifest: Text füllt sich Wort für Wort beim Scrollen
  const fwWorte = [];
  document.querySelectorAll('.manifest-text p').forEach(p => {
    const knoten = [...p.childNodes], frag = document.createDocumentFragment();
    knoten.forEach(n => {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach(t => {
          if (!t) return;
          if (t.trim()) { const sp = document.createElement('span'); sp.className = 'fw'; sp.textContent = t; frag.append(sp); fwWorte.push(sp); }
          else frag.append(document.createTextNode(' '));
        });
      } else { n.classList && n.classList.add('fw'); frag.append(n); fwWorte.push(n); }
    });
    p.innerHTML = ''; p.append(frag);
  });
  const manifestText = document.querySelector('.manifest-text');
  function fuelleText() {
    const r = manifestText.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (innerHeight * .8 - r.top) / (r.height + innerHeight * .25)));
    const n = Math.round(p * fwWorte.length);
    fwWorte.forEach((w, i) => w.classList.toggle('an', i < n));
  }

  // Leistungen: Stapel-Effekt — pinnte Karte schrumpft leicht, wenn die nächste darüberfährt
  const stapel = [...document.querySelectorAll('.drei .kachel')];
  function stapleKarten() {
    if (innerWidth <= 860) return;
    for (let i = 0; i < stapel.length - 1; i++) {
      const eigenTop = 108 + i * 18;
      const nTop = stapel[i + 1].getBoundingClientRect().top;
      const p = Math.max(0, Math.min(1, 1 - (nTop - eigenTop) / (innerHeight - eigenTop)));
      stapel[i].style.transform = `scale(${1 - p * .05}) translateY(${p * -8}px)`;
      stapel[i].style.filter = `brightness(${1 - p * .12})`;
    }
  }

  // Track Record: Galerie rollt seitlich, während man normal vorbeiscrollt (kein Pinning)
  const trackSektion = document.getElementById('track');
  const dealSpur = document.getElementById('dealSpur');
  const trackBalken = document.getElementById('trackBalken');
  let spurWeite = 0;
  function messeSpur() {
    trackSektion.style.height = '';
    if (innerWidth <= 860) { dealSpur.style.transform = ''; spurWeite = 0; return; }
    spurWeite = Math.max(0, dealSpur.scrollWidth - innerWidth);
  }
  function fahreSpur() {
    if (!spurWeite) return;
    const r = trackSektion.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (innerHeight - r.top) / (innerHeight + r.height)));
    dealSpur.style.transform = `translateX(${-p * spurWeite}px)`;
    trackBalken.style.width = (p * 100) + '%';
  }
  messeSpur();
  fahreSpur();
  addEventListener('resize', () => { messeSpur(); fahreSpur(); }, { passive: true });
  addEventListener('load', () => { messeSpur(); fahreSpur(); });
  hoch.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // Sanftes Erscheinen der Sektionen
  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('da')), { threshold: .1 });
  document.querySelectorAll('.enter').forEach(el => io.observe(el));

  // Count-up der Kennzahlen, sobald sichtbar
  const zaehlerIo = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting || e.target.dataset.fertig) return;
    e.target.dataset.fertig = '1';
    const ziel = Number(e.target.dataset.ziel);
    const start = performance.now(), dauer = 1400;
    const tick = t => {
      const p = Math.min(1, (t - start) / dauer);
      e.target.textContent = Math.round(ziel * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }), { threshold: .6 });
  document.querySelectorAll('.zaehler').forEach(el => zaehlerIo.observe(el));

  // Scrollspy: aktiven Navigationspunkt markieren
  const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const spyIo = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(l => l.classList.toggle('aktiv', l.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-40% 0px -55% 0px' });
  ['leistungen','track','partner','investitionen','wert','perspektiven','instinkt','ueber','kontakt']
    .forEach(id => { const el = document.getElementById(id); if (el) spyIo.observe(el); });

  // Eigener Cursor (nur mit Maus, nicht auf Touch)
  if (matchMedia('(pointer: fine)').matches) {
    const zeiger = document.createElement('div');
    zeiger.className = 'zeiger';
    document.body.appendChild(zeiger);
    let mx = innerWidth / 2, my = innerHeight / 2, zx = mx, zy = my;
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; zeiger.classList.add('an'); }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => zeiger.classList.remove('an'));
    (function folge() {
      zx += (mx - zx) * .22; zy += (my - zy) * .22;
      zeiger.style.left = zx + 'px'; zeiger.style.top = zy + 'px';
      requestAnimationFrame(folge);
    })();
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => zeiger.classList.add('gross'));
      el.addEventListener('mouseleave', () => zeiger.classList.remove('gross'));
    });

    // Dezenter 3D-Tilt auf Referenz-Karten
    document.querySelectorAll('.deal').forEach(k => {
      k.addEventListener('mousemove', e => {
        const r = k.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        k.style.transform = `perspective(700px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-2px)`;
      });
      k.addEventListener('mouseleave', () => k.style.transform = '');
    });

    // Magnetische CTAs
    document.querySelectorAll('.cta').forEach(b => {
      b.addEventListener('mousemove', e => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .1}px, ${(e.clientY - r.top - r.height / 2) * .28}px)`;
      });
      b.addEventListener('mouseleave', () => b.style.transform = '');
    });
  }

  // ---------- Analytics-Events (greifen nur nach Consent, wenn gtag/clarity geladen sind) ----------
  const getrackt = {};
  function track(name, params, einmalig) {
    if (einmalig && getrackt[name]) return;
    getrackt[name] = true;
    try {
      if (window.gtag) window.gtag('event', name, params || {});
      if (window.clarity) window.clarity('event', name);
    } catch (e) {}
  }

  // Ankaufs-Check: Auswahl -> sofortige Einschätzung + vorbefüllte Anfrage
  const wahl = {};
  document.querySelectorAll('.pillen').forEach(g => g.addEventListener('click', e => {
    const b = e.target.closest('.pille'); if (!b) return;
    g.querySelectorAll('.pille').forEach(p => p.classList.remove('aktiv'));
    b.classList.add('aktiv');
    wahl[g.dataset.gruppe] = b.dataset.wert;
    checkErgebnis();
  }));
  function checkErgebnis() {
    if (!wahl.kanton || !wahl.objekt || !wahl.preis) return;
    let text;
    if (wahl.preis === 'ueber2') text = KURO_T.checkUeber2;
    else if (wahl.kanton === 'anderer') text = KURO_T.checkAnderer;
    else if (wahl.objekt === 'gewerbe') text = KURO_T.checkGewerbe;
    else text = KURO_T.checkPasst;
    document.getElementById('checkText').textContent = text;
    const msg = KURO_T.checkMsg(KURO_T.checkObjekt[wahl.objekt], KURO_T.checkKanton[wahl.kanton], KURO_T.checkPreis[wahl.preis]);
    document.getElementById('checkWa').href = 'https://wa.me/41792522570?text=' + msg;
    document.getElementById('checkMail').href = 'mailto:kaito@kuroiwa.ch?subject=' + encodeURIComponent(KURO_T.checkMailSubject) + '&body=' + msg;
    track('ankaufs_check', { kanton: wahl.kanton, objekt: wahl.objekt, preis: wahl.preis }, true);
    document.getElementById('checkErgebnis').hidden = false;
  }

  // Preloader: Zähler 0-100, dann Vorhang nach oben
  const lade = document.getElementById('lade');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) lade.remove();
  else {
    const ladeZahl = document.getElementById('ladeZahl');
    const t0 = performance.now();
    requestAnimationFrame(function zaehl(t) {
      const p = Math.min(1, (t - t0) / 900);
      ladeZahl.innerHTML = Math.round(p * 100) + '&thinsp;%';
      if (p < 1) requestAnimationFrame(zaehl);
      else ladeWeg();
    });
    setTimeout(ladeWeg, 2500);
  }
  function ladeWeg() {
    if (!document.body.contains(lade)) return;
    lade.classList.add('weg');
    setTimeout(() => lade.remove(), 950);
  }

  // Split-Text: Headlines wortweise maskiert einblenden
  function splitte(el) {
    const knoten = [...el.childNodes], neu = document.createDocumentFragment();
    let i = 0;
    const huelle = inhalt => {
      const w = document.createElement('span'); w.className = 'w';
      const wi = document.createElement('span'); wi.className = 'wi';
      wi.style.transitionDelay = (i++ * 60) + 'ms';
      wi.append(inhalt); w.append(wi);
      return w;
    };
    knoten.forEach(n => {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach(t => {
          if (!t) return;
          if (t.trim()) neu.append(huelle(document.createTextNode(t)));
          else neu.append(document.createTextNode(' '));
        });
      } else if (n.tagName === 'BR') neu.append(n);
      else neu.append(huelle(n));
    });
    el.innerHTML = '';
    el.append(neu);
  }
  const splitIo = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('sichtbar')), { threshold: .3 });
  document.querySelectorAll('h1, section h2').forEach(h => { splitte(h); splitIo.observe(h); });

  // Kaskaden-Reveal für Karten-Grids
  document.querySelectorAll('.deals, .logowall').forEach(g => {
    [...g.children].forEach((k, idx) => {
      k.classList.add('stagger');
      k.style.transitionDelay = (idx * 90) + 'ms';
      k.addEventListener('transitionend', function frei(e) {
        if (e.propertyName !== 'transform') return;
        k.classList.add('frei'); k.style.transitionDelay = '';
        k.removeEventListener('transitionend', frei);
      });
    });
  });

  // E-Mail kopieren mit Bestätigung
  const toast = document.getElementById('toast');
  document.querySelectorAll('.kopier').forEach(b => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.mail); } catch (e) {}
    toast.classList.add('zeig');
    setTimeout(() => toast.classList.remove('zeig'), 2200);
  }));

  // Wert-Indikation: ertragsbasierte Sofort-Schätzung
  const RENDITE_REGION = { luzern: [3.6, 4.4], aargau: [4.0, 4.9], stgallen: [4.1, 5.0], uebrige: [3.8, 5.2] };
  const RENDITE_NUTZUNG = { wohnen: 0, wg: .3, buero: .8, gewerbe: 1.2 };
  const RENDITE_ZUSTAND = { saniert: -.3, gepflegt: 0, sanierungsbedarf: .7 };
  const wertErtrag = document.getElementById('wertErtrag');
  const chf = n => Math.round(n).toLocaleString('de-CH');

  function rechneWert() {
    const region = wahl.wregion, nutzung = wahl.wnutzung, zustand = wahl.wzustand;
    const ertrag = parseFloat(wertErtrag.value);
    const bereit = region && nutzung && zustand && ertrag > 0;
    document.getElementById('wertWarten').hidden = bereit;
    document.getElementById('wertResultat').hidden = !bereit;
    if (!bereit) return;
    const zuschlag = RENDITE_NUTZUNG[nutzung] + RENDITE_ZUSTAND[zustand];
    const [rMin, rMax] = RENDITE_REGION[region].map(r => r + zuschlag);
    const wertHoch = ertrag / (rMin / 100), wertTief = ertrag / (rMax / 100);
    const inMio = v => (v / 1e6).toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('wertZahl').innerHTML =
      wertHoch >= 1e6 ? KURO_T.wertZahlMio(inMio(wertTief), inMio(wertHoch))
                      : KURO_T.wertZahlChf(chf(wertTief), chf(wertHoch));
    const regionText = region === 'uebrige' && wertKanton.value ? wertKanton.selectedOptions[0].text : KURO_T.region[region];
    const nutzungText = KURO_T.nutzungW[nutzung], zustandText = KURO_T.zustand[zustand];
    document.getElementById('wertSub').textContent = KURO_T.wertSub(rMin.toFixed(1), rMax.toFixed(1), nutzungText, regionText, zustandText);
    const msg = KURO_T.wertMsg(nutzungText, regionText, zustandText, chf(ertrag), inMio(wertTief), inMio(wertHoch));
    document.getElementById('wertWa').href = 'https://wa.me/41792522570?text=' + msg;
    document.getElementById('wertMail').href = 'mailto:kaito@kuroiwa.ch?subject=' + encodeURIComponent(KURO_T.wertMailSubject) + '&body=' + msg;
    track('wert_indikation', { region: region, nutzung: nutzung, zustand: zustand }, true);
  }
  ['wregion', 'wnutzung', 'wzustand'].forEach(g => {
    document.querySelector(`.pillen[data-gruppe="${g}"]`).addEventListener('click', () => setTimeout(rechneWert));
  });
  const wertKanton = document.getElementById('wertKanton');
  document.querySelector('.pillen[data-gruppe="wregion"]').addEventListener('click', () => setTimeout(() => {
    wertKanton.hidden = wahl.wregion !== 'uebrige';
  }));
  wertKanton.addEventListener('change', rechneWert);
  const wertSlider = document.getElementById('wertSlider');
  wertSlider.addEventListener('input', () => { wertErtrag.value = wertSlider.value; rechneWert(); });
  wertErtrag.addEventListener('input', () => {
    wertSlider.value = Math.min(1000000, Math.max(0, parseFloat(wertErtrag.value) || 0));
    rechneWert();
  });

  // Miet-Indikation: m²-Preisbänder für Gewerbeflächen
  const MIETEN = {
    retail: { lage1a: [400, 900], lage1b: [250, 450], quartier: [150, 280] },
    buero:  { lage1a: [230, 390], lage1b: [180, 280], quartier: [130, 220] },
    gastro: { lage1a: [350, 700], lage1b: [220, 400], quartier: [150, 280] },
    lager:  { lage1a: [130, 220], lage1b: [100, 170], quartier: [70, 130] }
  };
  const STOCK_FAKTOR = {
    retail: { eg: 1, og: .55, ug: .45 },
    gastro: { eg: 1, og: .6, ug: .5 },
    buero:  { eg: 1.05, og: 1, ug: .6 },
    lager:  { eg: 1, og: .8, ug: .7 }
  };
  const KANTON_FAKTOR = {
    'Zürich': 1.35, 'Genf': 1.35, 'Zug': 1.25, 'Basel-Stadt': 1.15, 'Waadt': 1.15, 'Schwyz': 1.1,
    'Luzern': 1.05, 'Bern': 1, 'Basel-Landschaft': 1, 'St. Gallen': .95, 'Aargau': .95,
    'Graubünden': .95, 'Tessin': .95, 'Nidwalden': .9, 'Freiburg': .9, 'Thurgau': .85,
    'Solothurn': .85, 'Wallis': .85, 'Neuenburg': .85, 'Schaffhausen': .85, 'Obwalden': .85,
    'Glarus': .8, 'Uri': .8, 'Appenzell Ausserrhoden': .8, 'Appenzell Innerrhoden': .8, 'Jura': .75
  };
  const mietKanton = document.getElementById('mietKanton');
  const mietFlaeche = document.getElementById('mietFlaeche');
  const mietSlider = document.getElementById('mietSlider');
  function rechneMiete() {
    const nutzung = wahl.gnutzung, lage = wahl.glage, stock = wahl.gstock, kanton = mietKanton.value;
    const flaeche = parseFloat(mietFlaeche.value);
    const bereit = nutzung && lage && stock && kanton && flaeche > 0;
    document.getElementById('mietWarten').hidden = bereit;
    document.getElementById('mietResultat').hidden = !bereit;
    if (!bereit) return;
    const faktor = STOCK_FAKTOR[nutzung][stock] * (KANTON_FAKTOR[kanton] || 1);
    const runde5 = v => Math.round(v / 5) * 5;
    const [mMin, mMax] = MIETEN[nutzung][lage].map(v => runde5(v * faktor));
    const jahrMin = mMin * flaeche, jahrMax = mMax * flaeche;
    const nutzungText = KURO_T.nutzungG[nutzung], lageText = KURO_T.lage[lage], stockText = KURO_T.stock[stock];
    const kantonText = mietKanton.selectedOptions[0].text;
    document.getElementById('mietZahl').innerHTML = KURO_T.mietZahl(mMin, mMax);
    document.getElementById('mietSub').textContent = KURO_T.mietSub(chf(flaeche), nutzungText, lageText, stockText, kantonText, chf(jahrMin), chf(jahrMax), chf(jahrMin / 12), chf(jahrMax / 12));
    const msg = KURO_T.mietMsg(nutzungText, kantonText, lageText, stockText, chf(flaeche), mMin, mMax, chf(jahrMin), chf(jahrMax));
    document.getElementById('mietWa').href = 'https://wa.me/41792522570?text=' + msg;
    document.getElementById('mietMail').href = 'mailto:kaito@kuroiwa.ch?subject=' + encodeURIComponent(KURO_T.mietMailSubject) + '&body=' + msg;
    track('miet_indikation', { nutzung: nutzung, lage: lage, kanton: kanton }, true);
  }
  ['gnutzung', 'glage', 'gstock'].forEach(g => {
    document.querySelector(`.pillen[data-gruppe="${g}"]`).addEventListener('click', () => setTimeout(rechneMiete));
  });
  mietKanton.addEventListener('change', rechneMiete);
  mietSlider.addEventListener('input', () => { mietFlaeche.value = mietSlider.value; rechneMiete(); });
  mietFlaeche.addEventListener('input', () => {
    mietSlider.value = Math.min(2000, Math.max(0, parseFloat(mietFlaeche.value) || 0));
    rechneMiete();
  });

  // Service-Tabs: nur ein Werkzeug sichtbar
  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.toggle('aktiv', x === t));
    document.querySelectorAll('.tab-panel').forEach(p => { p.hidden = p.id !== 'panel-' + t.dataset.tab; });
  }));

  // Markt-Instinkt-Quiz
  const QUIZ_CFG = [
    { einheit: 'CHF', min: 0, max: 2000, step: 10, start: 500, antwort: 650 },
    { einheit: '%', min: 0, max: 100, step: 1, start: 40, antwort: 58 },
    { einheit: '%', min: 0, max: 5, step: 0.1, start: 2.5, antwort: 1 },
    { einheit: '%', min: 0, max: 10, step: 0.1, start: 5, antwort: 4 },
    { einheit: '%', min: 0, max: 100, step: 5, start: 20, antwort: 45 }
  ];
  const QUIZ = QUIZ_CFG.map((q, i) => Object.assign({}, q, KURO_T.quiz[i]));
  let quizIndex = 0, quizPunkteTotal = 0, quizGeprueft = false;
  const quizRegler = document.getElementById('quizRegler');
  const quizWert = document.getElementById('quizWert');
  function quizZeige() {
    const q = QUIZ[quizIndex];
    document.getElementById('quizNr').textContent = KURO_T.quizNr(quizIndex + 1, QUIZ.length);
    document.getElementById('quizFrage').textContent = q.f;
    document.getElementById('quizEinheit').textContent = q.einheit === '%' ? '%' : ' ' + q.einheit;
    quizRegler.min = q.min; quizRegler.max = q.max; quizRegler.step = q.step; quizRegler.value = q.start;
    quizWert.textContent = q.start;
    document.getElementById('quizAufloesung').hidden = true;
    document.getElementById('quizKnopf').textContent = KURO_T.quizPruefen;
    quizGeprueft = false;
  }
  quizRegler.addEventListener('input', () => { quizWert.textContent = quizRegler.value; });
  document.getElementById('quizKnopf').addEventListener('click', () => {
    const q = QUIZ[quizIndex];
    if (!quizGeprueft) {
      const fehler = Math.abs(parseFloat(quizRegler.value) - q.antwort) / (q.max - q.min);
      const punkte = Math.max(0, Math.round(20 * (1 - fehler * 2.5)));
      quizPunkteTotal += punkte;
      document.getElementById('quizPunkte').innerHTML = KURO_T.quizPunkte(q.antwort + (q.einheit === '%' ? '%' : ' ' + q.einheit), punkte);
      document.getElementById('quizQuelle').textContent = q.quelle;
      document.getElementById('quizAufloesung').hidden = false;
      document.getElementById('quizKnopf').textContent = quizIndex < QUIZ.length - 1 ? KURO_T.quizNaechste : KURO_T.quizErgebnis;
      quizGeprueft = true;
      return;
    }
    quizIndex++;
    if (quizIndex < QUIZ.length) { quizZeige(); return; }
    document.getElementById('quizLauf').hidden = true;
    document.getElementById('quizSchluss').hidden = false;
    const p = quizPunkteTotal;
    const titel = KURO_T.quizTitel(p);
    const fazit = KURO_T.quizFazit(p);
    document.getElementById('quizTitel').innerHTML = titel;
    document.getElementById('quizFazit').textContent = fazit;
    track('quiz_abgeschlossen', { punkte: p });
  });
  document.getElementById('quizNochmal').addEventListener('click', () => {
    quizIndex = 0; quizPunkteTotal = 0;
    document.getElementById('quizSchluss').hidden = true;
    document.getElementById('quizLauf').hidden = false;
    quizZeige();
  });
  quizZeige();

  // Ankaufs-Karte: Klick auf Region wählt sie im Rechner
  document.querySelectorAll('.marker').forEach(m => m.addEventListener('click', () => {
    document.querySelector('.tab[data-tab="wert"]').click();
    const pille = document.querySelector(`.pillen[data-gruppe="wregion"] .pille[data-wert="${m.dataset.region}"]`);
    if (pille) pille.click();
    document.getElementById('wert').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => wertErtrag.focus({ preventScroll: true }), 600);
  }));

  // Ortszeit Zug im Footer
  const ortszeit = document.getElementById('ortszeit');
  const zeitFormat = new Intl.DateTimeFormat('de-CH', { timeZone: 'Europe/Zurich', hour: '2-digit', minute: '2-digit' });
  (function uhr() { ortszeit.textContent = KURO_T.ortszeit + ' ' + zeitFormat.format(new Date()); setTimeout(uhr, 15000); })();

  // Klick-Tracking auf Kontakt-Kanäle
  document.querySelectorAll('a[href^="https://wa.me"]').forEach(a => a.addEventListener('click', () => track('whatsapp_click', { quelle: a.id || 'link' })));
  document.querySelectorAll('a[href^="tel:"]').forEach(a => a.addEventListener('click', () => track('kontakt_click', { typ: 'telefon' })));
  document.querySelectorAll('a[href^="mailto:"]').forEach(a => a.addEventListener('click', () => track('kontakt_click', { typ: 'email' })));

  // ---------- Lead-Formular (Formspree, AJAX + Fallback) ----------
  // Lead-Endpoint: Google-Apps-Script-Web-App (…/exec-URL aus der Bereitstellung) — gilt für alle Sprachversionen.
  const LEAD_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzdkZHVC7DLdei6T2joaBNTibmEj9msgwif9stfB0dS4-ff4RL0lYfk74QraaTI3PFXsw/exec';
  const leadForm = document.getElementById('leadForm');
  if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
      const status = document.getElementById('leadStatus');
      if (!/^https:/.test(LEAD_ENDPOINT)) {
        e.preventDefault();
        status.className = 'lead-status err';
        status.textContent = KURO_T.leadPlatzhalter;
        return;
      }
      if (!leadForm.checkValidity()) return;
      e.preventDefault();
      status.className = 'lead-status'; status.textContent = KURO_T.leadSenden;
      try {
        const daten = new URLSearchParams(new FormData(leadForm));
        daten.append('sprache', document.documentElement.lang || 'de-CH');
        const res = await fetch(LEAD_ENDPOINT, { method: 'POST', body: daten });
        const antwort = await res.json().catch(() => ({}));
        if (res.ok && antwort.ok !== false) {
          leadForm.style.display = 'none';
          document.getElementById('leadDank').classList.add('zeig');
          track('generate_lead', { method: 'kontaktformular' });
        } else {
          status.className = 'lead-status err';
          status.textContent = KURO_T.leadFehler;
        }
      } catch (err) {
        status.className = 'lead-status err';
        status.textContent = KURO_T.leadNetz;
      }
    });
  }

  // ---------- Consent-Banner (revDSG) ----------
  (function () {
    const banner = document.getElementById('consent');
    if (!banner) return;
    let choice = null;
    try { choice = localStorage.getItem('kuroiwa-consent'); } catch (e) {}
    if (!choice) banner.hidden = false;
    const accept = document.getElementById('consentAccept');
    const deny = document.getElementById('consentDeny');
    accept && accept.addEventListener('click', () => {
      if (window.Kuroiwa) window.Kuroiwa.grantConsent(); else { try { localStorage.setItem('kuroiwa-consent', 'granted'); } catch (e) {} }
      banner.hidden = true;
    });
    deny && deny.addEventListener('click', () => {
      if (window.Kuroiwa) window.Kuroiwa.revokeConsent(); else { try { localStorage.setItem('kuroiwa-consent', 'denied'); } catch (e) {} }
      banner.hidden = true;
    });
  })();

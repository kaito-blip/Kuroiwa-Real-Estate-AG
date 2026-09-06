/*!
 * Kuroiwa Real Estate — Monitoring & Analytics
 * ------------------------------------------------------------------
 * Zentraler, consent-fähiger Einstiegspunkt für alle Drittanbieter-Tools
 * (Fehler-Monitoring, Analytics, Session-Replay …).
 *
 * NEUES TOOL HINZUFÜGEN
 *   1. Eintrag in CONFIG ergänzen (mit `enabled` und `requiresConsent`).
 *   2. Eine Start-Funktion schreiben und unten in TOOLS registrieren.
 *   Consent, Buffering und Fehlerschutz sind zentral gelöst.
 *
 * ECHT-SCHALTEN
 *   • Sentry:  CONFIG.sentry.dsn mit der echten DSN aus sentry.io füllen.
 *   • GA4:     CONFIG.ga4.enabled = true + echte Mess-ID + Consent-Banner,
 *              das window.Kuroiwa.grantConsent() aufruft.
 * ------------------------------------------------------------------ */
(function () {
  'use strict';

  var CONFIG = {
    // Fehler- & Performance-Monitoring — berechtigtes Interesse, ohne Consent.
    sentry: {
      enabled: true,
      requiresConsent: false,
      dsn: 'https://PUBLIC_KEY@oXXXXXXX.ingest.de.sentry.io/PROJECT_ID', // TODO: echte DSN eintragen
      environment: 'production',
      release: 'kuroiwa-web@2026-09',
      tracesSampleRate: 0.1,          // Performance-Traces (0–1)
      replaysSessionSampleRate: 0.0,  // Session-Replay im Normalbetrieb
      replaysOnErrorSampleRate: 1.0   // Session-Replay bei Fehlern
    },

    // Google Analytics 4 — einwilligungspflichtig (DSG/DSGVO). Google-Ads-Verknüpfung
    // läuft über die GA4-Property (Verwaltung → Produktverknüpfungen), kein extra Code nötig.
    ga4: {
      enabled: false,                 // auf true setzen, wenn gewünscht
      requiresConsent: true,
      id: 'G-XXXXXXXXXX',             // TODO: echte Mess-ID eintragen
      anonymizeIp: true
    },

    // Microsoft Clarity (Heatmaps + Session-Recordings) — einwilligungspflichtig.
    clarity: {
      enabled: false,                 // auf true setzen, wenn gewünscht
      requiresConsent: true,
      id: 'XXXXXXXXXX'                // TODO: Clarity-Projekt-ID eintragen
    }

    // Weitere Tools nach gleichem Muster, z. B.:
    // plausible: { enabled: false, requiresConsent: false, domain: 'kuroiwa.ch' }
  };

  var PLACEHOLDER = /PUBLIC_KEY|PROJECT_ID|X{4,}/;
  var CONSENT_KEY = 'kuroiwa-consent';

  function hasConsent() {
    try { return localStorage.getItem(CONSENT_KEY) === 'granted'; } catch (e) { return false; }
  }
  function isPlaceholder(v) { return !v || PLACEHOLDER.test(v); }

  var loaded = {};
  function loadScript(src, attrs, onload) {
    if (loaded[src]) { if (onload) onload(); return; }
    loaded[src] = true;
    var s = document.createElement('script');
    s.src = src; s.async = true;
    if (attrs) { for (var k in attrs) s.setAttribute(k, attrs[k]); }
    if (onload) s.addEventListener('load', onload);
    s.addEventListener('error', function () { console.warn('[Kuroiwa] Laden fehlgeschlagen:', src); });
    document.head.appendChild(s);
  }

  // ---------- Sentry (Loader-Script, versionsunabhängig) ----------
  function startSentry() {
    var c = CONFIG.sentry;
    if (isPlaceholder(c.dsn)) {
      console.info('[Kuroiwa] Sentry inaktiv — echte DSN in assets/monitoring.js eintragen.');
      return;
    }
    var m = c.dsn.match(/^https:\/\/([^@]+)@/);
    if (!m) { console.warn('[Kuroiwa] Sentry-DSN unlesbar.'); return; }
    // Wird vom Sentry-Loader aufgerufen, sobald das SDK bereit ist.
    window.sentryOnLoad = function () {
      if (!window.Sentry) return;
      var integrations = [];
      if (window.Sentry.browserTracingIntegration) integrations.push(window.Sentry.browserTracingIntegration());
      if (window.Sentry.replayIntegration) integrations.push(window.Sentry.replayIntegration());
      window.Sentry.init({
        dsn: c.dsn,
        environment: c.environment,
        release: c.release,
        integrations: integrations,
        tracesSampleRate: c.tracesSampleRate,
        replaysSessionSampleRate: c.replaysSessionSampleRate,
        replaysOnErrorSampleRate: c.replaysOnErrorSampleRate
      });
    };
    loadScript('https://js.sentry-cdn.com/' + m[1] + '.min.js', { crossorigin: 'anonymous' });
  }

  // ---------- Google Analytics 4 (consent-pflichtig) ----------
  function startGA4() {
    var c = CONFIG.ga4;
    if (isPlaceholder(c.id)) return;
    loadScript('https://www.googletagmanager.com/gtag/js?id=' + c.id);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', c.id, { anonymize_ip: !!c.anonymizeIp });
  }

  // ---------- Microsoft Clarity (consent-pflichtig) ----------
  function startClarity() {
    var c = CONFIG.clarity;
    if (isPlaceholder(c.id)) return;
    window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
    loadScript('https://www.clarity.ms/tag/' + c.id);
  }

  // ---------- Registry: Tool-Name -> Start-Funktion ----------
  var TOOLS = { sentry: startSentry, ga4: startGA4, clarity: startClarity };

  function startTools(onlyConsentTools) {
    Object.keys(TOOLS).forEach(function (name) {
      var cfg = CONFIG[name];
      if (!cfg || !cfg.enabled || cfg.__started) return;
      var needs = !!cfg.requiresConsent;
      if (onlyConsentTools && !needs) return;   // in der Consent-Phase nur Consent-Tools
      if (needs && !hasConsent()) return;       // Consent-Tools nur mit Einwilligung
      cfg.__started = true;
      try { TOOLS[name](); } catch (e) { console.warn('[Kuroiwa] Start fehlgeschlagen:', name, e); }
    });
  }

  // ---------- Öffentliche API (für ein späteres Consent-Banner) ----------
  var K = window.Kuroiwa = window.Kuroiwa || {};
  K.grantConsent = function () {
    try { localStorage.setItem(CONSENT_KEY, 'granted'); } catch (e) {}
    startTools(true);
  };
  K.revokeConsent = function () {
    try { localStorage.setItem(CONSENT_KEY, 'denied'); } catch (e) {}
  };
  K.hasConsent = hasConsent;

  // ---------- Start ----------
  startTools(false); // essenzielle Tools sofort; Consent-Tools, sobald Einwilligung vorliegt
})();

/**
 * Kuroiwa Real Estate — Lead-Endpoint + Mini-CRM + täglicher KPI-Report
 * =====================================================================
 * EINMALIGE EINRICHTUNG (5 Minuten, siehe auch INTEGRATIONS.md):
 *   1. script.google.com → Neues Projekt → diesen Code einfügen.
 *   2. Links „Dienste" (+) → «AnalyticsData» hinzufügen (für den KPI-Report).
 *   3. Unten CONFIG ausfüllen (GA4_PROPERTY_ID kann anfangs leer bleiben).
 *   4. Funktion setup() einmal ausführen (Berechtigungen bestätigen)
 *      → erstellt Lead-Sheet + täglichen Trigger 07:00.
 *   5. Deployen: «Bereitstellen → Neue Bereitstellung → Web-App»,
 *      Ausführen als: ICH, Zugriff: JEDER → die /exec-URL kopieren
 *      → in der Website in assets/app.js bei LEAD_ENDPOINT eintragen.
 */

var CONFIG = {
  EMPFAENGER: 'kaito@kuroiwa.ch',        // wohin Lead-Mails + KPI-Report gehen
  ABSENDER: 'kaito@kuroiwa.ch',           // Gmail-«Senden als»-Alias — alle Mails gehen als diese Adresse raus
  ABSENDER_NAME: 'Kuroiwa Real Estate',
  GA4_PROPERTY_ID: '',                    // z. B. '123456789' (GA4 → Verwaltung → Property-Details); leer = Report ohne GA4-Zahlen
  REPORT_STUNDE: 7                        // Uhrzeit des täglichen KPI-Mails
};

// ---------------------------------------------------------------- Lead-Endpoint
function doPost(e) {
  try {
    var p = (e && e.parameter) || {};
    if (p._gotcha) return _json({ ok: true });              // Honeypot: Bots still schlucken
    if (!p.email || !p.name || !p.nachricht) return _json({ ok: false, fehler: 'Pflichtfelder fehlen' });

    var zeile = [new Date(), p.name, p.email, p.telefon || '', p.anliegen || '', p.nachricht, p.sprache || '', 'neu'];
    _sheet().appendRow(zeile);

    // 1) Benachrichtigung an Kaito
    GmailApp.sendEmail(CONFIG.EMPFAENGER,
      '🔴 Neuer Lead: ' + (p.anliegen || 'Anfrage') + ' — ' + p.name,
      '', {
        name: CONFIG.ABSENDER_NAME,
        from: CONFIG.ABSENDER,
        replyTo: p.email,
        htmlBody: '<div style="font-family:Helvetica,Arial,sans-serif;max-width:560px">' +
          '<h2 style="margin:0 0 14px">Neuer Lead über kuroiwa.ch</h2>' +
          '<table cellpadding="6" style="border-collapse:collapse;font-size:14px">' +
          _tr('Name', p.name) + _tr('E-Mail', p.email) + _tr('Telefon', p.telefon || '—') +
          _tr('Anliegen', p.anliegen || '—') + _tr('Sprache', p.sprache || '—') +
          '</table><p style="white-space:pre-wrap;background:#f6f5f2;padding:14px;border-left:3px solid #c0271f">' +
          _esc(p.nachricht) + '</p>' +
          '<p style="color:#888;font-size:12px">Antworten geht direkt an den Interessenten (Reply-To gesetzt). Lead-Log: im Spreadsheet «Kuroiwa Leads».</p></div>'
      });

    // 2) Auto-Bestätigung an den Interessenten (Sprache der besuchten Seite)
    var s = (p.sprache || 'de').slice(0, 2);
    var t = {
      de: ['Ihre Anfrage bei Kuroiwa Real Estate', 'Guten Tag ' + p.name + '\n\nVielen Dank für Ihre Anfrage — sie ist bei uns eingegangen. Sie erhalten in der Regel innert 24 Stunden eine persönliche Rückmeldung.\n\nFreundliche Grüsse\nKaito Weingart\nKuroiwa Real Estate AG · Baarerstrasse 107 · 6300 Zug\n+41 79 252 25 70 · kuroiwa.ch'],
      en: ['Your enquiry with Kuroiwa Real Estate', 'Dear ' + p.name + '\n\nThank you for your enquiry — it has been received. You will normally hear back from us personally within 24 hours.\n\nKind regards\nKaito Weingart\nKuroiwa Real Estate AG · Baarerstrasse 107 · 6300 Zug\n+41 79 252 25 70 · kuroiwa.ch'],
      fr: ['Votre demande auprès de Kuroiwa Real Estate', 'Bonjour ' + p.name + '\n\nMerci pour votre demande — nous l\'avons bien reçue. Vous recevrez en règle générale une réponse personnelle sous 24 heures.\n\nMeilleures salutations\nKaito Weingart\nKuroiwa Real Estate AG · Baarerstrasse 107 · 6300 Zug\n+41 79 252 25 70 · kuroiwa.ch'],
      it: ['La Sua richiesta presso Kuroiwa Real Estate', 'Buongiorno ' + p.name + '\n\nGrazie per la Sua richiesta — è stata ricevuta. Di norma riceverà una risposta personale entro 24 ore.\n\nCordiali saluti\nKaito Weingart\nKuroiwa Real Estate AG · Baarerstrasse 107 · 6300 Zug\n+41 79 252 25 70 · kuroiwa.ch']
    };
    var m = t[s] || t.de;
    GmailApp.sendEmail(p.email, m[0], m[1], { name: CONFIG.ABSENDER_NAME, from: CONFIG.ABSENDER, replyTo: CONFIG.EMPFAENGER });

    return _json({ ok: true });
  } catch (err) {
    return _json({ ok: false, fehler: String(err) });
  }
}

// ---------------------------------------------------------------- Täglicher KPI-Report
function dailyReport() {
  var gestern = _datum(-1), heute = new Date();
  var html = '<div style="font-family:Helvetica,Arial,sans-serif;max-width:640px;color:#111">' +
             '<h2 style="margin:0 0 4px">Kuroiwa KPI — ' + gestern + '</h2>' +
             '<p style="color:#888;margin:0 0 18px;font-size:13px">Täglicher Report · kuroiwa.ch</p>';
  var betreffZusatz = '';

  // Leads aus dem Sheet (funktioniert auch ohne GA4)
  var sh = _sheet(), daten = sh.getDataRange().getValues();
  var leadsGestern = 0, leadsTotal = Math.max(0, daten.length - 1);
  for (var i = 1; i < daten.length; i++) {
    var d = new Date(daten[i][0]);
    if (Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd') === gestern) leadsGestern++;
  }
  html += _kpiZeile('📥 Leads gestern', leadsGestern + '  (total: ' + leadsTotal + ')');
  betreffZusatz += leadsGestern + ' Leads';

  if (CONFIG.GA4_PROPERTY_ID) {
    try {
      var prop = 'properties/' + CONFIG.GA4_PROPERTY_ID;
      // Kernzahlen: gestern vs. Ø letzte 7 Tage
      var kern = AnalyticsData.Properties.runReport({
        dateRanges: [{ startDate: 'yesterday', endDate: 'yesterday' }, { startDate: '8daysAgo', endDate: '2daysAgo' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }, { name: 'engagementRate' }, { name: 'averageSessionDuration' }, { name: 'keyEvents' }]
      }, prop);
      var g = _reihe(kern, 0), w = _reihe(kern, 1);
      var engRate = (parseFloat(g[2]) * 100).toFixed(0) + '%';
      var dauer = Math.round(parseFloat(g[3])) + 's';
      html += _kpiZeile('👥 Sessions / Nutzer', g[0] + ' / ' + g[1] + '  (7-Tage-Ø: ' + Math.round(w[0] / 7) + '/Tag)');
      html += _kpiZeile('🔥 Engagement-Rate', engRate + ' · Ø Sitzungsdauer ' + dauer);
      html += _kpiZeile('⭐ Key Events gestern', g[4]);
      betreffZusatz = g[0] + ' Sessions · ' + betreffZusatz;

      // Interaktionen (unsere Events)
      var ev = AnalyticsData.Properties.runReport({
        dateRanges: [{ startDate: 'yesterday', endDate: 'yesterday' }],
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }],
        dimensionFilter: { filter: { fieldName: 'eventName', inListFilter: { values: ['wert_indikation', 'miet_indikation', 'ankaufs_check', 'quiz_abgeschlossen', 'whatsapp_click', 'kontakt_click', 'generate_lead'] } } }
      }, prop);
      html += '<h3 style="margin:20px 0 8px;font-size:15px">Interaktionen gestern</h3>';
      if (ev.rows && ev.rows.length) {
        for (var r = 0; r < ev.rows.length; r++)
          html += _kpiZeile('· ' + ev.rows[r].dimensionValues[0].value, ev.rows[r].metricValues[0].value);
      } else html += '<p style="color:#888;font-size:13px">Keine Tool-Interaktionen.</p>';

      // Top-Quellen
      var q = AnalyticsData.Properties.runReport({
        dateRanges: [{ startDate: 'yesterday', endDate: 'yesterday' }],
        dimensions: [{ name: 'sessionSource' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }], limit: 5
      }, prop);
      html += '<h3 style="margin:20px 0 8px;font-size:15px">Top-Quellen</h3>';
      if (q.rows) for (var s2 = 0; s2 < q.rows.length; s2++)
        html += _kpiZeile('· ' + q.rows[s2].dimensionValues[0].value, q.rows[s2].metricValues[0].value + ' Sessions');
    } catch (err) {
      html += '<p style="color:#c0271f">GA4-Abruf fehlgeschlagen: ' + _esc(String(err)) + '</p>';
    }
  } else {
    html += '<p style="color:#888;font-size:13px">GA4_PROPERTY_ID noch nicht gesetzt — Report zeigt vorerst nur Leads.</p>';
  }

  html += '<p style="margin-top:22px;font-size:12px;color:#888">Clarity-Heatmaps: clarity.microsoft.com · GA4: analytics.google.com · Leads: Spreadsheet «Kuroiwa Leads»</p></div>';
  GmailApp.sendEmail(CONFIG.EMPFAENGER, '📊 Kuroiwa KPI ' + gestern + ' — ' + betreffZusatz, '', { name: CONFIG.ABSENDER_NAME, from: CONFIG.ABSENDER, htmlBody: html });
}

// ---------------------------------------------------------------- Setup (einmal ausführen)
function setup() {
  _sheet();                                                     // Lead-Sheet anlegen
  ScriptApp.getProjectTriggers().forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('dailyReport').timeBased().everyDays(1).atHour(CONFIG.REPORT_STUNDE).create();
  Logger.log('Setup OK — Sheet bereit, täglicher Report um ' + CONFIG.REPORT_STUNDE + ' Uhr aktiv.');
}

// ---------------------------------------------------------------- Helfer
function _sheet() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SHEET_ID');
  var ss;
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch (e) { id = null; } }
  if (!id) {
    ss = SpreadsheetApp.create('Kuroiwa Leads');
    ss.getActiveSheet().appendRow(['Zeitpunkt', 'Name', 'E-Mail', 'Telefon', 'Anliegen', 'Nachricht', 'Sprache', 'Status']);
    ss.getActiveSheet().setFrozenRows(1);
    props.setProperty('SHEET_ID', ss.getId());
  }
  return ss.getActiveSheet();
}
function _json(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function _esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function _tr(k, v) { return '<tr><td style="color:#888;border-bottom:1px solid #eee">' + k + '</td><td style="border-bottom:1px solid #eee"><b>' + _esc(v) + '</b></td></tr>'; }
function _kpiZeile(k, v) { return '<p style="margin:4px 0;font-size:14px"><span style="display:inline-block;min-width:230px;color:#555">' + k + '</span><b>' + v + '</b></p>'; }
function _reihe(report, idx) {
  var out = ['0', '0', '0', '0', '0'];
  if (report.rows) for (var i = 0; i < report.rows.length; i++) {
    var r = report.rows[i];
    var rangeIdx = r.dimensionValues && r.dimensionValues.length ? (r.dimensionValues[0].value === 'date_range_' + idx ? idx : -1) : i;
    if (i === idx || rangeIdx === idx) { out = r.metricValues.map(function (m) { return m.value; }); break; }
  }
  return out;
}
function _datum(offsetTage) {
  var d = new Date(); d.setDate(d.getDate() + offsetTage);
  return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

/**
 * Kuroiwa Real Estate — Lead-Endpoint + Mini-CRM + täglicher KPI-Report  (v3)
 * ===========================================================================
 * NACH JEDER ÄNDERUNG: Cmd+S, dann «Bereitstellen → Bereitstellungen
 * verwalten → ✏️ → Version: Neue Version → Bereitstellen» (URL bleibt gleich!).
 */

var VERSION = 'v3';

var CONFIG = {
  EMPFAENGER: 'kaito@kuroiwa.ch',
  ABSENDER: 'kaito@kuroiwa.ch',          // Absender Lead-Alarm + KPI-Report
  ABSENDER_ANTWORT: 'info@kuroiwa.ch',   // Absender der Auto-Antwort an Interessenten
  ABSENDER_NAME: 'Kuroiwa Real Estate',
  GA4_PROPERTY_ID: '',                   // z. B. '123456789' — leer = Report ohne GA4-Zahlen
  REPORT_STUNDE: 7
};

var INK = '#0b0b0c', PAPER = '#f6f5f2', ROT = '#c0271f', GRAU = '#8d8b86';

// Versions-Check: GET auf die /exec-URL zeigt, welche Version deployed ist
function doGet() {
  return ContentService.createTextOutput('Kuroiwa Backend ' + VERSION + ' — Lead-Endpoint aktiv');
}

// ---------------------------------------------------------------- Lead-Endpoint
function doPost(e) {
  try {
    var p = (e && e.parameter) || {};
    if (p._gotcha) return _json({ ok: true });
    if (!p.email || !p.name || !p.nachricht) return _json({ ok: false, fehler: 'Pflichtfelder fehlen' });

    _sheet().appendRow([new Date(), p.name, p.email, p.telefon || '', p.anliegen || '', p.nachricht, p.sprache || '', 'neu']);

    var wa = String(p.telefon || '').replace(/[^0-9]/g, '');
    if (wa.charAt(0) === '0') wa = '41' + wa.slice(1);

    // ---------- 1) Lead-Alarm an Kaito ----------
    var inhalt =
      '<p style="margin:0 0 6px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:' + ROT + ';font-weight:bold">Neuer Lead &middot; ' + _esc(p.anliegen || 'Anfrage') + '</p>' +
      '<h1 style="margin:0 0 22px;font-family:Georgia,serif;font-weight:normal;font-size:28px;color:' + INK + '">' + _esc(p.name) + '</h1>' +
      '<table cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;color:#333">' +
      _zeile('E-Mail', '<a href="mailto:' + _esc(p.email) + '" style="color:' + INK + ';font-weight:bold;text-decoration:none">' + _esc(p.email) + '</a>') +
      _zeile('Telefon', p.telefon ? '<b>' + _esc(p.telefon) + '</b>' : '<span style="color:' + GRAU + '">&mdash;</span>') +
      _zeile('Sprache', '<b>' + _esc((p.sprache || 'de').slice(0, 2).toUpperCase()) + '</b>') +
      _zeile('Eingang', '<b>' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd.MM.yyyy · HH:mm') + '</b>') +
      '</table>' +
      '<div style="margin:24px 0;padding:18px 22px;background:' + PAPER + ';border-left:3px solid ' + ROT + ';font-size:15px;line-height:1.65;color:#222;white-space:pre-wrap">' + _esc(p.nachricht) + '</div>' +
      '<table cellpadding="0" cellspacing="0"><tr>' +
      _btn('mailto:' + p.email, 'Antworten', true) +
      (p.telefon ? _btn('tel:' + String(p.telefon).replace(/\s/g, ''), 'Anrufen', false) : '') +
      (wa ? _btn('https://wa.me/' + wa, 'WhatsApp', false) : '') +
      '</tr></table>';

    GmailApp.sendEmail(CONFIG.EMPFAENGER, 'Lead: ' + (p.anliegen || 'Anfrage') + ' — ' + p.name, '', {
      name: CONFIG.ABSENDER_NAME, from: CONFIG.ABSENDER, replyTo: p.email,
      htmlBody: _rahmen(inhalt, 'Lead-Log: <a href="' + _sheetUrl() + '" style="color:' + GRAU + '">Spreadsheet «Kuroiwa Leads»</a> &middot; Antworten geht direkt an den Interessenten.')
    });

    // ---------- 2) Auto-Bestätigung an den Interessenten ----------
    var s = (p.sprache || 'de').slice(0, 2);
    var T = {
      de: { betreff: 'Ihre Anfrage bei Kuroiwa Real Estate', anrede: 'Guten Tag ' + p.name,
            text: 'Vielen Dank für Ihre Anfrage — sie ist bei uns eingegangen. Sie erhalten in der Regel <b>innert 24 Stunden</b> eine persönliche Rückmeldung.',
            gruss: 'Freundliche Grüsse',
            legal: 'Diese E-Mail kann vertrauliche Informationen enthalten. Sollten Sie nicht der richtige Adressat sein, informieren Sie bitte den Absender und löschen Sie diese E-Mail.' },
      en: { betreff: 'Your enquiry with Kuroiwa Real Estate', anrede: 'Dear ' + p.name,
            text: 'Thank you for your enquiry — it has been received. You will normally hear back from us personally <b>within 24 hours</b>.',
            gruss: 'Kind regards',
            legal: 'This e-mail may contain confidential information. If you are not the intended recipient, please notify the sender and delete this e-mail.' },
      fr: { betreff: 'Votre demande auprès de Kuroiwa Real Estate', anrede: 'Bonjour ' + p.name,
            text: "Merci pour votre demande — nous l'avons bien reçue. Vous recevrez en règle générale une réponse personnelle <b>sous 24 heures</b>.",
            gruss: 'Meilleures salutations',
            legal: 'Ce courriel peut contenir des informations confidentielles. Si vous n’êtes pas le destinataire prévu, veuillez en informer l’expéditeur et supprimer ce courriel.' },
      it: { betreff: 'La Sua richiesta presso Kuroiwa Real Estate', anrede: 'Buongiorno ' + p.name,
            text: 'Grazie per la Sua richiesta — è stata ricevuta. Di norma riceverà una risposta personale <b>entro 24 ore</b>.',
            gruss: 'Cordiali saluti',
            legal: 'Questa e-mail può contenere informazioni riservate. Se non siete il destinatario previsto, vi preghiamo di informare il mittente e cancellare questa e-mail.' }
    };
    var t = T[s] || T.de;
    var antwort =
      '<p style="margin:0 0 18px;font-family:Georgia,serif;font-size:22px;color:' + INK + '">' + _esc(t.anrede) + '</p>' +
      '<p style="margin:0 0 8px;font-size:15px;line-height:1.7;color:#333">' + t.text + '</p>' +
      '<p style="margin:22px 0 18px;font-size:15px;color:#333">' + _esc(t.gruss) + '</p>' +
      _signatur();
    GmailApp.sendEmail(p.email, t.betreff, '', {
      name: CONFIG.ABSENDER_NAME, from: CONFIG.ABSENDER_ANTWORT, replyTo: CONFIG.ABSENDER_ANTWORT,
      htmlBody: _rahmen(antwort, t.legal + '<br>Kuroiwa Real Estate AG &middot; Baarerstrasse 107 &middot; CH-6300 Zug &middot; <a href="https://kuroiwa.ch" style="color:' + GRAU + '">kuroiwa.ch</a>')
    });

    return _json({ ok: true, version: VERSION });
  } catch (err) {
    return _json({ ok: false, fehler: String(err) });
  }
}

// ---------------------------------------------------------------- Täglicher KPI-Report
function dailyReport() {
  var gestern = _datum(-1);
  var inhalt =
    '<p style="margin:0 0 6px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:' + ROT + ';font-weight:bold">Täglicher KPI-Report</p>' +
    '<h1 style="margin:0 0 24px;font-family:Georgia,serif;font-weight:normal;font-size:26px;color:' + INK + '">' + gestern + '</h1>';
  var betreffZusatz = '';

  var sh = _sheet(), daten = sh.getDataRange().getValues();
  var leadsGestern = 0, leadsTotal = Math.max(0, daten.length - 1);
  for (var i = 1; i < daten.length; i++) {
    if (Utilities.formatDate(new Date(daten[i][0]), Session.getScriptTimeZone(), 'yyyy-MM-dd') === gestern) leadsGestern++;
  }
  inhalt += _kpi('Leads gestern', leadsGestern + ' <span style="color:' + GRAU + '">(total ' + leadsTotal + ')</span>');
  betreffZusatz += leadsGestern + ' Leads';

  if (CONFIG.GA4_PROPERTY_ID) {
    try {
      var prop = 'properties/' + CONFIG.GA4_PROPERTY_ID;
      var kern = AnalyticsData.Properties.runReport({
        dateRanges: [{ startDate: 'yesterday', endDate: 'yesterday' }, { startDate: '8daysAgo', endDate: '2daysAgo' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }, { name: 'engagementRate' }, { name: 'averageSessionDuration' }, { name: 'keyEvents' }]
      }, prop);
      var g = _reihe(kern, 0), w = _reihe(kern, 1);
      inhalt += _kpi('Sessions / Nutzer', g[0] + ' / ' + g[1] + ' <span style="color:' + GRAU + '">(7-Tage-Ø: ' + Math.round(w[0] / 7) + '/Tag)</span>');
      inhalt += _kpi('Engagement-Rate', (parseFloat(g[2]) * 100).toFixed(0) + '% <span style="color:' + GRAU + '">· Ø ' + Math.round(parseFloat(g[3])) + 's/Sitzung</span>');
      inhalt += _kpi('Key Events', g[4]);
      betreffZusatz = g[0] + ' Sessions · ' + betreffZusatz;

      var ev = AnalyticsData.Properties.runReport({
        dateRanges: [{ startDate: 'yesterday', endDate: 'yesterday' }],
        dimensions: [{ name: 'eventName' }], metrics: [{ name: 'eventCount' }],
        dimensionFilter: { filter: { fieldName: 'eventName', inListFilter: { values: ['wert_indikation', 'miet_indikation', 'ankaufs_check', 'quiz_abgeschlossen', 'whatsapp_click', 'kontakt_click', 'generate_lead'] } } }
      }, prop);
      inhalt += _titel('Interaktionen');
      if (ev.rows && ev.rows.length) for (var r = 0; r < ev.rows.length; r++)
        inhalt += _kpi(ev.rows[r].dimensionValues[0].value, ev.rows[r].metricValues[0].value);
      else inhalt += '<p style="font-size:13px;color:' + GRAU + '">Keine Tool-Interaktionen.</p>';

      var q = AnalyticsData.Properties.runReport({
        dateRanges: [{ startDate: 'yesterday', endDate: 'yesterday' }],
        dimensions: [{ name: 'sessionSource' }], metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }], limit: 5
      }, prop);
      inhalt += _titel('Top-Quellen');
      if (q.rows) for (var s2 = 0; s2 < q.rows.length; s2++)
        inhalt += _kpi(q.rows[s2].dimensionValues[0].value, q.rows[s2].metricValues[0].value + ' Sessions');
    } catch (err) {
      inhalt += '<p style="color:' + ROT + ';font-size:13px">GA4-Abruf fehlgeschlagen: ' + _esc(String(err)) + '</p>';
    }
  } else {
    inhalt += '<p style="font-size:13px;color:' + GRAU + '">GA4_PROPERTY_ID noch nicht gesetzt — Report zeigt vorerst nur Leads.</p>';
  }

  GmailApp.sendEmail(CONFIG.EMPFAENGER, 'Kuroiwa KPI ' + gestern + ' — ' + betreffZusatz, '', {
    name: CONFIG.ABSENDER_NAME, from: CONFIG.ABSENDER,
    htmlBody: _rahmen(inhalt, '<a href="https://analytics.google.com" style="color:' + GRAU + '">GA4</a> &middot; <a href="https://clarity.microsoft.com" style="color:' + GRAU + '">Clarity</a> &middot; <a href="' + _sheetUrl() + '" style="color:' + GRAU + '">Lead-Sheet</a>')
  });
}

function setup() {
  _sheet();
  ScriptApp.getProjectTriggers().forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('dailyReport').timeBased().everyDays(1).atHour(CONFIG.REPORT_STUNDE).create();
  Logger.log('Setup OK — Sheet bereit, täglicher Report um ' + CONFIG.REPORT_STUNDE + ' Uhr aktiv.');
}
function testReport() { dailyReport(); }

// ---------------------------------------------------------------- E-Mail-Design
function _rahmen(inhalt, fussnote) {
  return '<table cellpadding="0" cellspacing="0" width="100%" style="background:#edebe6;padding:0;margin:0"><tr><td align="center" style="padding:32px 16px">' +
    '<table cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%">' +
    '<tr><td style="background:' + INK + ';padding:26px 36px">' +
    '<span style="font-family:Georgia,\'Times New Roman\',serif;font-size:26px;color:' + PAPER + ';letter-spacing:.5px">Kuroiwa<span style="color:' + ROT + '">.</span></span>' +
    '<span style="float:right;font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:3px;color:rgba(246,245,242,.5);padding-top:10px">REAL&nbsp;ESTATE</span>' +
    '</td></tr>' +
    '<tr><td style="height:3px;background:' + ROT + ';font-size:0">&nbsp;</td></tr>' +
    '<tr><td style="background:#ffffff;padding:36px;font-family:Helvetica,Arial,sans-serif">' + inhalt + '</td></tr>' +
    '<tr><td style="background:' + INK + ';padding:16px 36px;font-family:Helvetica,Arial,sans-serif;font-size:10px;color:rgba(246,245,242,.5);line-height:1.7">' + (fussnote || '') + '</td></tr>' +
    '</table></td></tr></table>';
}
// Signatur-Karte im Stil der KWI-Signatur (dunkel, drei Spalten, roter Abschluss)
function _signatur() {
  return '<table cellpadding="0" cellspacing="0" width="100%" style="background:' + INK + ';border-bottom:3px solid ' + ROT + '"><tr>' +
    '<td style="padding:22px 24px;vertical-align:top">' +
    '<span style="font-family:Helvetica,Arial,sans-serif;color:' + PAPER + ';font-size:16px;font-weight:bold">Kaito Weingart</span><br>' +
    '<span style="font-family:Helvetica,Arial,sans-serif;color:' + ROT + ';font-size:9px;letter-spacing:2px;font-weight:bold">FOUNDER</span>' +
    '<p style="margin:14px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.9">' +
    '<span style="color:#777">Mobil:</span>&nbsp; <a href="tel:+41792522570" style="color:' + PAPER + ';text-decoration:none">+41 (0) 79 252 25 70</a><br>' +
    '<span style="color:#777">Mail:</span>&nbsp; <a href="mailto:kaito@kuroiwa.ch" style="color:' + PAPER + ';text-decoration:none">kaito@kuroiwa.ch</a></p></td>' +
    '<td style="padding:22px 24px;vertical-align:top;border-left:1px solid #26262a">' +
    '<span style="font-family:Georgia,serif;color:' + PAPER + ';font-size:18px">Kuroiwa<span style="color:' + ROT + '">.</span></span><br>' +
    '<span style="font-family:Helvetica,Arial,sans-serif;color:' + GRAU + ';font-size:8.5px;letter-spacing:2.5px">KUROIWA&nbsp;REAL&nbsp;ESTATE&nbsp;AG</span>' +
    '<p style="margin:12px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#bbb;line-height:1.7">Baarerstrasse 107<br>CH-6300 Zug, Schweiz</p></td>' +
    '<td width="64" style="padding:22px 18px;vertical-align:middle;border-left:2px solid ' + ROT + ';text-align:center">' +
    '<span style="color:' + PAPER + ';font-size:21px;line-height:1.35;font-family:serif">黒<br>岩</span></td>' +
    '</tr></table>';
}
function _btn(url, label, voll) {
  var st = voll ? 'background:' + ROT + ';color:#ffffff;border:1px solid ' + ROT
                : 'background:#ffffff;color:' + INK + ';border:1px solid #cccccc';
  return '<td style="padding-right:10px"><a href="' + url + '" style="display:inline-block;padding:12px 22px;font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:bold;text-decoration:none;border-radius:2px;' + st + '">' + label + '</a></td>';
}
function _zeile(k, v) {
  return '<tr><td style="padding:9px 0;border-bottom:1px solid #eeeeee;color:' + GRAU + ';font-size:11px;letter-spacing:1.5px;text-transform:uppercase;width:110px">' + k + '</td>' +
         '<td style="padding:9px 0;border-bottom:1px solid #eeeeee">' + v + '</td></tr>';
}
function _kpi(k, v) { return '<p style="margin:6px 0;font-size:14px;color:#333"><span style="display:inline-block;min-width:220px;color:#555">' + k + '</span><b>' + v + '</b></p>'; }
function _titel(t) { return '<p style="margin:24px 0 8px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:' + ROT + ';font-weight:bold;border-bottom:1px solid #eee;padding-bottom:6px">' + t + '</p>'; }

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
function _sheetUrl() {
  var id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  return id ? 'https://docs.google.com/spreadsheets/d/' + id : 'https://drive.google.com';
}
function _json(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function _esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
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

/**
 * ========================================
 * META ADS AUTOMATION - GOOGLE SHEET SETUP
 * ========================================
 *
 * INSTRUKTIONER:
 * 1. Skapa ett nytt Google Sheet
 * 2. Gå till Extensions → Apps Script
 * 3. Ta bort all befintlig kod
 * 4. Klistra in HELA denna kod
 * 5. Klicka på Save (Ctrl+S)
 * 6. Klicka på Run (play-knappen)
 * 7. Godkänn behörigheter när du blir tillfrågad
 * 8. Gå tillbaka till ditt sheet - klart!
 */

function setupMetaAdsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // ===== SKAPA SETTINGS-FLIK =====
  let settingsSheet = ss.getSheetByName('Settings');
  if (!settingsSheet) {
    settingsSheet = ss.insertSheet('Settings');
  } else {
    settingsSheet.clear();
  }

  // Rubriker
  settingsSheet.getRange('A1:B1').setValues([['Setting', 'Value']]);
  settingsSheet.getRange('A1:B1')
    .setFontWeight('bold')
    .setBackground('#1a73e8')
    .setFontColor('white');

  // Alla settings med beskrivningar
  const settings = [
    // Konto-inställningar
    ['', ''],
    ['=== KONTO (obligatoriskt) ===', ''],
    ['ad_account_id', ''],
    ['facebook_page_id', ''],
    ['pixel_id', ''],
    ['', ''],

    // Budget och targeting
    ['=== BUDGET & TARGETING (obligatoriskt) ===', ''],
    ['daily_budget', '100'],
    ['target_countries', 'SE'],
    ['', ''],

    // Website
    ['=== WEBSITE (obligatoriskt om ej i formulär) ===', ''],
    ['website_url', ''],
    ['', ''],

    // Valfria inställningar
    ['=== VALFRITT (har defaults) ===', ''],
    ['optimization_goal', 'OFFSITE_CONVERSIONS'],
    ['conversion_event', 'PURCHASE'],
    ['bid_strategy', 'LOWEST_COST_WITHOUT_CAP'],
    ['', ''],

    // Slack
    ['=== SLACK (valfritt) ===', ''],
    ['slack_channel', '']
  ];

  settingsSheet.getRange(2, 1, settings.length, 2).setValues(settings);

  // Formatera sektionsrubriker
  const dataRange = settingsSheet.getDataRange();
  const values = dataRange.getValues();
  for (let i = 0; i < values.length; i++) {
    if (values[i][0].startsWith('===')) {
      settingsSheet.getRange(i + 1, 1, 1, 2)
        .setBackground('#f0f0f0')
        .setFontWeight('bold')
        .setFontStyle('italic');
    }
  }

  // Kolumnbredder
  settingsSheet.setColumnWidth(1, 250);
  settingsSheet.setColumnWidth(2, 350);

  // Lägg till instruktioner i kolumn D
  const instructions = [
    ['INSTRUKTIONER'],
    [''],
    ['ad_account_id:'],
    ['Ditt Meta Ad Account ID (bara siffror, utan "act_")'],
    ['Hittas i: Business Settings → Ad Accounts'],
    [''],
    ['facebook_page_id:'],
    ['Din Facebook-sidas ID'],
    ['Hittas i: Din sida → About → Page ID'],
    [''],
    ['pixel_id:'],
    ['Din Meta Pixel ID'],
    ['Hittas i: Events Manager → Data Sources'],
    [''],
    ['daily_budget:'],
    ['Budget per dag i KRONOR (inte cents)'],
    ['Exempel: 100 = 100 kr/dag'],
    [''],
    ['target_countries:'],
    ['Landskoder separerade med komma'],
    ['Exempel: SE,NO,DK för Sverige, Norge, Danmark'],
    [''],
    ['website_url:'],
    ['Din landningssida (standard om ej angiven i formulär)'],
    [''],
    ['slack_channel:'],
    ['Slack kanal-ID för notifikationer (valfritt)'],
    ['Högerklicka på kanal → Copy link → sista delen av URL']
  ];

  settingsSheet.getRange(1, 4, instructions.length, 1).setValues(instructions);
  settingsSheet.getRange('D1').setFontWeight('bold').setFontSize(12);
  settingsSheet.getRange('D2:D30').setFontColor('#666666').setFontStyle('italic');
  settingsSheet.setColumnWidth(4, 400);

  // ===== SKAPA ADS LOG-FLIK =====
  let adsLogSheet = ss.getSheetByName('Ads Log');
  if (!adsLogSheet) {
    adsLogSheet = ss.insertSheet('Ads Log');
  } else {
    adsLogSheet.clear();
  }

  // Rubriker för Ads Log
  const headers = [
    'Timestamp',
    'FileName',
    'AdName',
    'MediaType',
    'CampaignID',
    'AdSetID',
    'AdSetName',
    'CreativeID',
    'AdID',
    'Status'
  ];

  adsLogSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  adsLogSheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#34a853')
    .setFontColor('white');

  // Kolumnbredder
  adsLogSheet.setColumnWidth(1, 150);   // Timestamp
  adsLogSheet.setColumnWidth(2, 200);   // FileName
  adsLogSheet.setColumnWidth(3, 250);   // AdName
  adsLogSheet.setColumnWidth(4, 100);   // MediaType
  adsLogSheet.setColumnWidth(5, 180);   // CampaignID
  adsLogSheet.setColumnWidth(6, 180);   // AdSetID
  adsLogSheet.setColumnWidth(7, 200);   // AdSetName
  adsLogSheet.setColumnWidth(8, 180);   // CreativeID
  adsLogSheet.setColumnWidth(9, 180);   // AdID
  adsLogSheet.setColumnWidth(10, 100);  // Status

  // Frys rubrikraden
  adsLogSheet.setFrozenRows(1);

  // ===== TA BORT STANDARD SHEET OM DET FINNS =====
  const defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    ss.deleteSheet(defaultSheet);
  }

  // Aktivera Settings-fliken
  settingsSheet.activate();

  // ===== VISA BEKRÄFTELSE =====
  const sheetId = ss.getId();
  SpreadsheetApp.getUi().alert(
    '✅ SETUP KLAR!\n\n' +
    'Ditt Google Sheet är nu redo.\n\n' +
    '📋 DITT SHEET ID:\n' + sheetId + '\n\n' +
    'NÄSTA STEG:\n' +
    '1. Fyll i alla obligatoriska värden i Settings-fliken\n' +
    '2. Kopiera Sheet ID ovan\n' +
    '3. Klistra in i n8n-workflowet\n\n' +
    'Se STEG-FOR-STEG-GUIDE.md för detaljerade instruktioner.'
  );

  Logger.log('Sheet setup complete. Sheet ID: ' + sheetId);
}

/**
 * Skapar en meny för enkel åtkomst
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🚀 Meta Ads')
    .addItem('Kör Setup', 'setupMetaAdsSheet')
    .addItem('Visa Sheet ID', 'showSheetId')
    .addItem('Validera Settings', 'validateSettings')
    .addToUi();
}

/**
 * Visar Sheet ID
 */
function showSheetId() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  SpreadsheetApp.getUi().alert(
    '📋 DITT SHEET ID:\n\n' +
    ss.getId() + '\n\n' +
    'Kopiera detta och klistra in i n8n-workflowet\n' +
    '(i noderna "Get Settings" och "Log to Sheet")'
  );
}

/**
 * Validerar att alla obligatoriska settings är ifyllda
 */
function validateSettings() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Settings');

  if (!sheet) {
    SpreadsheetApp.getUi().alert('❌ Settings-fliken saknas! Kör Setup först.');
    return;
  }

  const data = sheet.getDataRange().getValues();
  const settings = {};

  for (const row of data) {
    if (row[0] && !row[0].startsWith('===') && row[0] !== 'Setting') {
      settings[row[0]] = row[1];
    }
  }

  const required = ['ad_account_id', 'facebook_page_id', 'pixel_id', 'daily_budget', 'target_countries'];
  const missing = [];

  for (const key of required) {
    if (!settings[key] || settings[key] === '') {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    SpreadsheetApp.getUi().alert(
      '❌ SAKNADE VÄRDEN:\n\n' +
      missing.join('\n') + '\n\n' +
      'Fyll i dessa i Settings-fliken innan du använder automatiseringen.'
    );
  } else {
    SpreadsheetApp.getUi().alert(
      '✅ ALLA OBLIGATORISKA SETTINGS ÄR IFYLLDA!\n\n' +
      'Du kan nu använda automatiseringen.\n\n' +
      'Glöm inte att:\n' +
      '1. Kopiera Sheet ID till n8n\n' +
      '2. Skapa en Google Drive-mapp med dina bilder/videor'
    );
  }
}

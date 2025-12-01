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
    ['=== META KONTO (obligatoriskt) ===', ''],
    ['ad_account_id', '261297039993717'],
    ['facebook_page_id', '334560683076234'],
    ['pixel_id', '1485774658810931'],
    ['campaign_id', ''],
    ['', ''],

    // Google Drive mappar
    ['=== GOOGLE DRIVE (obligatoriskt) ===', ''],
    ['creative_folder_id', ''],
    ['uploaded_folder_id', ''],
    ['', ''],

    // Budget och targeting
    ['=== BUDGET & TARGETING (obligatoriskt) ===', ''],
    ['daily_budget', '100'],
    ['target_countries', 'SE'],
    ['', ''],

    // Annonsinnehåll
    ['=== ANNONSINNEHALL (obligatoriskt) ===', ''],
    ['website_url', ''],
    ['primary_text', ''],
    ['headline', ''],
    ['description', ''],
    ['call_to_action', 'SHOP_NOW'],
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
  settingsSheet.setColumnWidth(2, 400);

  // Lägg till instruktioner i kolumn D
  const instructions = [
    ['INSTRUKTIONER'],
    [''],
    ['=== META KONTO ==='],
    ['ad_account_id: Ditt Meta Ad Account ID (bara siffror)'],
    ['Hittas i: Business Settings -> Ad Accounts'],
    [''],
    ['facebook_page_id: Din Facebook-sidas ID'],
    ['Hittas i: Din sida -> About -> Page ID'],
    [''],
    ['pixel_id: Din Meta Pixel ID'],
    ['Hittas i: Events Manager -> Data Sources'],
    [''],
    ['campaign_id: ID for kampanjen dar Ad Sets skapas'],
    ['Hittas i: Ads Manager -> Klicka pa kampanj -> Se URL'],
    [''],
    ['=== GOOGLE DRIVE ==='],
    ['creative_folder_id: ID for din Creative Folder'],
    ['Detta ar huvudmappen dar editors lagger undermappar'],
    ['Hittas i: Oppna mappen -> Kopiera ID fran URL'],
    ['URL: drive.google.com/drive/folders/DETTA_AR_ID'],
    [''],
    ['uploaded_folder_id: ID for Uploaded mappen'],
    ['Hit flyttas mappar automatiskt efter uppladdning'],
    [''],
    ['=== BUDGET & TARGETING ==='],
    ['daily_budget: Budget per dag i KRONOR (t.ex. 100)'],
    ['target_countries: Landskoder (t.ex. SE,NO,DK)'],
    [''],
    ['=== ANNONSINNEHALL ==='],
    ['website_url: Landningssida for alla annonser'],
    ['primary_text: Huvudtext i annonsen'],
    ['headline: Rubrik under bilden/videon'],
    ['description: Extra beskrivning (valfritt)'],
    ['call_to_action: Knapptext (SHOP_NOW, LEARN_MORE, etc)'],
    [''],
    ['=== CALL TO ACTION ALTERNATIV ==='],
    ['SHOP_NOW, LEARN_MORE, SIGN_UP, BOOK_NOW,'],
    ['CONTACT_US, GET_OFFER, ORDER_NOW, BUY_NOW, SUBSCRIBE']
  ];

  settingsSheet.getRange(1, 4, instructions.length, 1).setValues(instructions);
  settingsSheet.getRange('D1').setFontWeight('bold').setFontSize(12);
  settingsSheet.getRange('D3').setFontWeight('bold');
  settingsSheet.getRange('D16').setFontWeight('bold');
  settingsSheet.getRange('D25').setFontWeight('bold');
  settingsSheet.getRange('D29').setFontWeight('bold');
  settingsSheet.getRange('D36').setFontWeight('bold');
  settingsSheet.getRange('D2:D40').setFontColor('#666666');
  settingsSheet.setColumnWidth(4, 450);

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
    'FolderName',
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
  adsLogSheet.setColumnWidth(2, 180);   // FolderName
  adsLogSheet.setColumnWidth(3, 180);   // FileName
  adsLogSheet.setColumnWidth(4, 200);   // AdName
  adsLogSheet.setColumnWidth(5, 100);   // MediaType
  adsLogSheet.setColumnWidth(6, 150);   // CampaignID
  adsLogSheet.setColumnWidth(7, 150);   // AdSetID
  adsLogSheet.setColumnWidth(8, 180);   // AdSetName
  adsLogSheet.setColumnWidth(9, 150);   // CreativeID
  adsLogSheet.setColumnWidth(10, 150);  // AdID
  adsLogSheet.setColumnWidth(11, 100);  // Status

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
    'SETUP KLAR!\n\n' +
    'Ditt Google Sheet ar nu redo.\n\n' +
    'DITT SHEET ID:\n' + sheetId + '\n\n' +
    'NASTA STEG:\n' +
    '1. Fyll i alla obligatoriska varden i Settings-fliken\n' +
    '2. Kopiera Sheet ID ovan\n' +
    '3. Klistra in i n8n-workflowet\n\n' +
    'Se STEG-FOR-STEG-GUIDE.md for detaljerade instruktioner.'
  );

  Logger.log('Sheet setup complete. Sheet ID: ' + sheetId);
}

/**
 * Skapar en meny for enkel atkomst
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Meta Ads')
    .addItem('Kor Setup', 'setupMetaAdsSheet')
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
    'DITT SHEET ID:\n\n' +
    ss.getId() + '\n\n' +
    'Kopiera detta och klistra in i n8n-workflowet\n' +
    '(i noderna "Get Settings" och "Log to Sheet")'
  );
}

/**
 * Validerar att alla obligatoriska settings ar ifyllda
 */
function validateSettings() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Settings');

  if (!sheet) {
    SpreadsheetApp.getUi().alert('Settings-fliken saknas! Kor Setup forst.');
    return;
  }

  const data = sheet.getDataRange().getValues();
  const settings = {};

  for (const row of data) {
    if (row[0] && !row[0].startsWith('===') && row[0] !== 'Setting') {
      settings[row[0]] = row[1];
    }
  }

  const required = [
    'ad_account_id',
    'facebook_page_id',
    'pixel_id',
    'campaign_id',
    'creative_folder_id',
    'uploaded_folder_id',
    'daily_budget',
    'target_countries',
    'website_url',
    'primary_text',
    'headline',
    'call_to_action'
  ];
  const missing = [];

  for (const key of required) {
    if (!settings[key] || settings[key] === '') {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    SpreadsheetApp.getUi().alert(
      'SAKNADE VARDEN:\n\n' +
      missing.join('\n') + '\n\n' +
      'Fyll i dessa i Settings-fliken innan du anvander automatiseringen.'
    );
  } else {
    SpreadsheetApp.getUi().alert(
      'ALLA OBLIGATORISKA SETTINGS AR IFYLLDA!\n\n' +
      'Du kan nu anvanda automatiseringen.\n\n' +
      'Sa har fungerar det:\n' +
      '1. Editors lagger mappar i Creative Folder\n' +
      '2. Mappnamn = Ad Set namn\n' +
      '3. Filnamn = Creative/Annonsnamn\n' +
      '4. Du klickar Run i n8n\n' +
      '5. Allt laddas upp automatiskt!'
    );
  }
}

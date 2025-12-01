/**
 * Meta Ads Automation - Google Sheet Setup Script
 *
 * INSTRUKTIONER:
 * 1. Skapa ett nytt Google Sheet
 * 2. Gå till Extensions → Apps Script
 * 3. Ta bort all befintlig kod
 * 4. Klistra in hela denna fil
 * 5. Klicka på Save (Ctrl+S)
 * 6. Klicka på Run
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

  // Rubriker för Settings
  settingsSheet.getRange('A1:B1').setValues([['Setting', 'Value']]);
  settingsSheet.getRange('A1:B1')
    .setFontWeight('bold')
    .setBackground('#4285f4')
    .setFontColor('white');

  // Default settings
  const settings = [
    ['ad_account_id', ''],
    ['facebook_page_id', ''],
    ['slack_channel', '']
  ];

  settingsSheet.getRange(2, 1, settings.length, 2).setValues(settings);

  // Formatering
  settingsSheet.setColumnWidth(1, 200);
  settingsSheet.setColumnWidth(2, 300);

  // Lägg till instruktioner
  settingsSheet.getRange('D1').setValue('INSTRUKTIONER:');
  settingsSheet.getRange('D1').setFontWeight('bold');
  settingsSheet.getRange('D2').setValue('ad_account_id = Ditt Meta Ad Account ID (bara siffror, utan "act_")');
  settingsSheet.getRange('D3').setValue('facebook_page_id = Din Facebook-sidas ID');
  settingsSheet.getRange('D4').setValue('slack_channel = Slack kanal-ID för notifikationer (valfritt)');
  settingsSheet.getRange('D2:D4').setFontStyle('italic').setFontColor('#666666');

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
    'AdName',
    'MediaType',
    'CampaignID',
    'AdSetID',
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
  adsLogSheet.setColumnWidth(1, 150);  // Timestamp
  adsLogSheet.setColumnWidth(2, 250);  // AdName
  adsLogSheet.setColumnWidth(3, 100);  // MediaType
  adsLogSheet.setColumnWidth(4, 180);  // CampaignID
  adsLogSheet.setColumnWidth(5, 180);  // AdSetID
  adsLogSheet.setColumnWidth(6, 180);  // CreativeID
  adsLogSheet.setColumnWidth(7, 180);  // AdID
  adsLogSheet.setColumnWidth(8, 100);  // Status

  // Frys rubrikraden
  adsLogSheet.setFrozenRows(1);

  // ===== TA BORT STANDARD SHEET OM DET FINNS =====
  const defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    ss.deleteSheet(defaultSheet);
  }

  // ===== VISA BEKRÄFTELSE =====
  SpreadsheetApp.getUi().alert(
    'Setup klar! ✓\n\n' +
    'Ditt sheet är nu redo att användas med Meta Ads Automation.\n\n' +
    'Nästa steg:\n' +
    '1. Fyll i ad_account_id och facebook_page_id i Settings-fliken\n' +
    '2. Kopiera Sheet ID från URL:en\n' +
    '3. Klistra in i n8n-workflowet\n\n' +
    'Sheet ID: ' + ss.getId()
  );

  Logger.log('Sheet setup complete. Sheet ID: ' + ss.getId());
}

/**
 * Skapar en meny i Google Sheets för enkel åtkomst
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Meta Ads Setup')
    .addItem('Kör Setup', 'setupMetaAdsSheet')
    .addItem('Visa Sheet ID', 'showSheetId')
    .addToUi();
}

/**
 * Visar Sheet ID i en dialogruta
 */
function showSheetId() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  SpreadsheetApp.getUi().alert(
    'Ditt Sheet ID:\n\n' + ss.getId() + '\n\n' +
    'Kopiera detta och klistra in i n8n-workflowet.'
  );
}

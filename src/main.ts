import * as Service from './Menu/AppsScript/service';
import { customMenu } from './Menu/AppsScript/utils';

const onOpen = (): void => {
  const menu = SpreadsheetApp.getUi().createMenu('Custom menu');
  menu.addItem('custom menu', 'customMenu_');
  menu.addToUi();
};

const getId = Service.getId;
const getSpreadSheetName = Service.getSpreadSheetName;
const initConfig = Service.initConfig;
// const getId = (): string => {
//   const userid = Session.getActiveUser().getEmail();
//   console.log(`get id: ${userid}`);

//   return userid;
// };

// const getSpreadSheetName = (): string => {
//   const sheetname = ss.getName();

//   return sheetname;
// };

/**
 * 設定シートのデフォルトリスト
 * A列 ラベル名
 * B列 背景色（16進数）
 */

// const initConfig = (): void => {
//   const lock = LockService.getScriptLock();
//   try {
//     lock.waitLock(10 * 1000);
//     const sheets = ss.getSheets();
//     const target = sheets.filter((s) => s.getSheetName() === CONFIG_SHEET);
//     let configSheet: GoogleAppsScript.Spreadsheet.Sheet | null = null;
//     if (target.length === 0) {
//       configSheet = ss.insertSheet(0);
//       configSheet.setName(CONFIG_SHEET);
//     } else {
//       configSheet = target[0];
//       configSheet.clear().clearNotes();
//     }
//     const CONFIG_DEFAULT_VALUES = [
//       ['Labels', 'colors'],
//       ['All Right!', '#61a7e9'],
//       ['Hmm...', '#f4ff5e'],
//     ];
//     configSheet.setFrozenRows(1);

//     const range = configSheet.getRange(
//       CONFIG_DEFAULT_VALUES.length,
//       CONFIG_DEFAULT_VALUES[0].length
//     );
//     range.setValues(CONFIG_DEFAULT_VALUES);

//     lock.releaseLock();
//   } catch (e) {
//     Logger.log(e);
//   }
// };

// Exposed to GAS global function

global.onOpen = onOpen;
global.customMenu_ = customMenu;
global.getId = getId;
global.getSpreadSheetName = getSpreadSheetName;
global.initConfig = initConfig;

// Exposed to Frontend API
export { getId, getSpreadSheetName, initConfig };

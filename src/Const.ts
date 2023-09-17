const ss = SpreadsheetApp.getActive();

// 設定用シート名
const CONFIG_SHEET = '設定';

/**
 * 設定シートのデフォルトリスト
 * A列 ラベル名
 * B列 背景色（16進数）
 */

const INIT_CONFIG_DEFAULT = (): void => {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10 * 1000);
    const sheets = ss.getSheets();
    const target = sheets.filter((s) => s.getSheetName() === CONFIG_SHEET);
    let configSheet: GoogleAppsScript.Spreadsheet.Sheet | null = null;
    if (target.length === 0) {
      configSheet = ss.insertSheet(0);
      configSheet.setName(CONFIG_SHEET);
    } else {
      configSheet = target[0];
      configSheet.clear().clearNotes();
    }
    const CONFIG_DEFAULT_VALUES = [
      ['Labels', 'colors'],
      ['All Right!', '#61a7e9'],
      ['Hmm...', '#f4ff5e'],
    ];
    configSheet.setFrozenRows(1);

    const range = configSheet.getRange(
      CONFIG_DEFAULT_VALUES.length,
      CONFIG_DEFAULT_VALUES[0].length
    );
    range.setValues(CONFIG_DEFAULT_VALUES);

    lock.releaseLock();
  } catch (e) {
    Logger.log(e);
  }
};

export { ss, INIT_CONFIG_DEFAULT };

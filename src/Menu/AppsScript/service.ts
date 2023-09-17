import { ss, CONFIG_SHEET } from '@/Const';

const getId = (): string => {
  const userid = Session.getActiveUser().getEmail();
  console.log(`get id: ${userid}`);

  return userid;
};

const getSpreadSheetName = (): string => {
  const sheetname = ss.getName();

  return sheetname;
};

/**
 * 設定シートのデフォルトリスト
 * A列 ラベル名
 * B列 背景色（16進数）
 */

export type InitResponse =
  | {
      success: true;
    }
  | {
      success: false;
      error: Error;
    };

const setBG = (range: GoogleAppsScript.Spreadsheet.Range): void => {
  const pattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const values = range.getValues();
  let bgs: Array<Array<string | null>> = [];
  for (let colCellIdx = 1; colCellIdx <= values.length; colCellIdx++) {
    let rowBgs: Array<string | null> = [];
    for (let rowCellIdx = 1; rowCellIdx <= values[0].length; rowCellIdx++) {
      const cell = range.getCell(colCellIdx, rowCellIdx);
      const col16 = cell.getDisplayValue();
      rowBgs = [...rowBgs, pattern.test(col16) ? col16 : null];
    }
    bgs = [...bgs, rowBgs];
  }
  range.setBackgrounds(bgs);
};

const initConfig = (): InitResponse => {
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

    // TODO: set another place, not here
    // TODO: NON hard coding
    const CONFIG_DEFAULT_VALUES = [
      ['Labels', 'colors'],
      ['All Right!', '#61a7e9'],
      ['Hmm...', '#f4ff5e'],
    ];
    configSheet.setFrozenRows(1);

    const range = configSheet.getRange(
      1,
      1,
      CONFIG_DEFAULT_VALUES.length,
      CONFIG_DEFAULT_VALUES[0].length
    );
    range.setValues(CONFIG_DEFAULT_VALUES);

    // BG Color (based column B)
    const colorRange = range.offset(0, 1, CONFIG_DEFAULT_VALUES.length, 1);
    console.log(colorRange.getValues());
    setBG(colorRange);

    // 設定シート以外全部削除
    for (const sheet of sheets) {
      if (sheet !== configSheet) ss.deleteSheet(sheet);
    }

    lock.releaseLock();

    return { success: true };
  } catch (e: unknown) {
    Logger.log(e);

    return { success: false, error: e as Error };
  } finally {
    lock.releaseLock();
  }
};

export { getId, getSpreadSheetName, initConfig };

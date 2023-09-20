import {
  ss,
  CONFIG_SHEET,
  CONFIG_DEFAULT,
  CONFIG_HEADER,
  CONFIG_DEFAULT_COLUMN_OFFSET,
  CONFIG_DEFAULT_ROW_OFFSET,
  CONFIG_LABEL,
  CONFIG_COLOR,
} from '@/Const';
import { type LabelData } from '../components/menuParts/labels/labels';
import { ConfigSheetError } from '../errors';
import { type Labels } from '../types';

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
      errMsg: string;
    };

/**
 * colorize cells. should be 16-based rgb expression in 'range'
 * @param {GoogleAppsScript.Spreadsheet.Range} range
 * @return {void}
 */
const setBG = (range: GoogleAppsScript.Spreadsheet.Range): void => {
  const pattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const values = range.getValues();
  let bgs: Array<Array<string | null>> = [];
  for (let colCellIdx = 1; colCellIdx <= values.length; colCellIdx++) {
    let rowBgs: Array<string | null> = [];
    for (let rowCellIdx = 1; rowCellIdx <= values[0].length; rowCellIdx++) {
      const cell = range.getCell(colCellIdx, rowCellIdx);
      const col16 = cell.getDisplayValue();
      if (pattern.test(col16)) {
        rowBgs = [...rowBgs, col16];
      } else {
        rowBgs = [...rowBgs, null];
        cell.setValue('#000000');
      }
    }
    bgs = [...bgs, rowBgs];
  }
  range.setBackgrounds(bgs);
};

/**
 * initialize sheet. set default values for `CONFIG_SHEET`
 * @returns {InitResponse}
 */
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

    configSheet.setFrozenRows(1);

    const range = configSheet.getRange(
      CONFIG_DEFAULT_ROW_OFFSET,
      CONFIG_DEFAULT_COLUMN_OFFSET,
      CONFIG_DEFAULT.length,
      CONFIG_DEFAULT[0].length
    );
    range.setValues(CONFIG_DEFAULT);

    // BG Color (based column B)
    // (1, 1) -> (header回避1->2へ移動, A->Bへ移動)
    const colorRange = range.offset(1, 1, CONFIG_DEFAULT.length - 1, 1);
    console.log('values:\n', colorRange.getValues());
    setBG(colorRange);

    // 設定シート以外全部削除
    for (const sheet of sheets) {
      if (sheet !== configSheet) ss.deleteSheet(sheet);
    }
    const prot = configSheet.protect();
    prot.setDescription('設定シート');
    prot.removeEditors(prot.getEditors());
    prot.addEditor(getId());
    // configSheet.hideSheet();

    return { success: true };
  } catch (e: unknown) {
    Logger.log(e);
    const err = e as Error;

    return { success: false, error: err, errMsg: err.message };
  } finally {
    lock.releaseLock();
  }
};

/**
 * ラベル取得・設定
 */
export type LabelResponse =
  | { success: true; body: Labels }
  | { success: false; error: Error; errorMsg?: string };

const getLabelConfig = (): LabelResponse => {
  try {
    const values = ss
      .getSheetByName(CONFIG_SHEET)
      ?.getDataRange()
      .getDisplayValues();
    if (values === undefined)
      throw new ConfigSheetError('config sheet not found');
    for (let i = 0; i < values[0].length; i++) {
      if (values[0][i] !== CONFIG_HEADER[i])
        throw new ConfigSheetError('invalid header config sheet');
    }
    const labelIdx = values[0].indexOf(CONFIG_LABEL);
    if (labelIdx === -1)
      throw new ConfigSheetError(`not found '${CONFIG_LABEL}' on header`);
    const colorIdx = values[0].indexOf(CONFIG_COLOR);
    if (colorIdx === -1)
      throw new ConfigSheetError(`not found '${CONFIG_COLOR}' on header`);

    return {
      success: true,
      body: {
        labels: values.map((d) => d[labelIdx]).slice(1),
        colors: values.map((d) => d[colorIdx]).slice(1),
      },
    };
  } catch (e: unknown) {
    Logger.log(e);
    if (e instanceof ConfigSheetError) {
      return { success: false, error: e, errorMsg: e.message };
    } else {
      return { success: false, error: e as Error };
    }
  }
};

// TODO: alias string
/**
 *
 * @param {string} data - comming as stringified object data, by "JSON.stringify"
 * @returns
 */
const setLabelConfig = (data: string): boolean => {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(1 * 3000);
    console.log('aaa');
    const d = JSON.parse(data) as LabelData;
    console.log(`data from front:`);
    console.log(`row string: ${data}`);
    console.log(d);

    return true;
  } catch (e: unknown) {
    return false;
  } finally {
    lock.releaseLock();
    console.log('ooo');
  }
};

export {
  getId,
  getSpreadSheetName,
  initConfig,
  getLabelConfig,
  setLabelConfig,
};

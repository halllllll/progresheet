import { PROPERTY_DEFAULT, ss } from '@/Const/GAS';
import { CONFIG_SHEET_NAMES } from '@/Const/SheetEnv';
import { type GASError } from '../errors';
import { initConfig } from './service';

const customMenu = (): void => {
  const html = HtmlService.createHtmlOutputFromFile('menu.html')
    .setWidth(800)
    .setHeight(800);
  SpreadsheetApp.getUi().showModalDialog(html, 'menu');
};

/**
 * return a property by propertyName
 * @param {string} propertyName
 * @returns {string | null}
 */
const getPropertyByName = (propertyName: string): string | null => {
  const properties = PropertiesService.getScriptProperties();

  return properties.getProperty(propertyName);
};

/**
 * reset and init Properties values
 */
const setDefaultProperty = (): void => {
  const properties = PropertiesService.getScriptProperties();
  properties.deleteAllProperties();
  properties.setProperties(PROPERTY_DEFAULT);
};

// メニューにつけるやつ、Promiseでも大丈夫なんか？エラーは起きてないけど
const initMenu = async (): Promise<void> => {
  const ui = SpreadsheetApp.getUi();
  let btn = ui.alert('初期化します', ui.ButtonSet.OK_CANCEL);
  if (btn === ui.Button.CANCEL) return;
  btn = ui.alert(
    '本当に初期化します。よろしいですか？',
    ui.ButtonSet.OK_CANCEL
  );
  if (btn === ui.Button.CANCEL) return;
  const res = await initConfig();
  if (res.success) {
    ui.alert('初期化しました');
  } else {
    ui.alert(
      `初期化に失敗しました。。。\n${res.error.code}\n${res.error.message}`
    );
  }
};

/**
 * compare arg arrays has same element
 * @param {string[]} values
 * @param {string[]} expected
 * @returns {boolean}
 */
const isSameRow = (values: string[], expected: string[]): boolean => {
  return (
    values.length === expected.length &&
    values.every((ele, idx) => ele === expected[idx])
  );
};

type RowAt = {
  index: number;
  error: GASError | null;
};
/**
 * find index the target of row
 * @param {string} target
 * @param {Array<string>} row
 * @returns {RowAt}
 */
const rowAt = (target: string, row: string[]): RowAt => {
  /**
   * Apps Script環境はES6までしか対応してないのでArray.includesが使えない
   */
  const idx = row.indexOf(target);
  if (idx === -1) {
    Logger.log(`not found '${target}' on header`);

    return {
      index: idx,
      error: {
        code: 'SheetHeader',
        message: `not found '${target}' on header`,
      },
    };
  }

  return {
    index: idx,
    error: null,
  };
};

/**
 * find a sheet named sheetName
 * @param {string} sheetName
 * @returns {GoogleAppsScript.Spreadsheet.Sheet}
 */

const getTargetSheet = (
  sheetName: string
): GoogleAppsScript.Spreadsheet.Sheet | null => {
  const sheets = ss.getSheets();
  const targets = sheets.filter((s) => s.getSheetName() === sheetName);

  return targets.length === 0 ? null : targets[0];
};

type ConfigSheetData = {
  values: string[][];
  error: GASError | null;
};
/**
 * return the all values at sheet
 * if not found, return error
 * @param sheetName
 * @returns
 */
const getSheetValues = (
  ss: GoogleAppsScript.Spreadsheet.Spreadsheet,
  sheetName: string
): ConfigSheetData => {
  // check valid sheet name
  const targetSheet = getTargetSheet(sheetName);
  if (targetSheet === null) {
    Logger.log(`sheet "${sheetName}" not found`);

    return {
      error: {
        code: 'SheetNotFound',
        message: `sheet "${sheetName}" not found`,
      },
      values: [],
    };
  }
  const values = targetSheet.getDataRange().getDisplayValues();

  return {
    error: null,
    values,
  };
};

type ConfigSeets = {
  configSheets: GoogleAppsScript.Spreadsheet.Sheet[];
  error: GASError | null;
};
/**
 *
 * @returns {ConfigSeets}
 */
const getConfigSheets = (): ConfigSeets => {
  let configSheets: GoogleAppsScript.Spreadsheet.Sheet[] = [];
  for (const sheetName of CONFIG_SHEET_NAMES) {
    const targetSheet = getTargetSheet(sheetName);
    if (targetSheet === null) {
      return {
        configSheets: [],
        error: {
          code: 'Config',
          message: `${sheetName} not found`,
        },
      };
    }
    configSheets = [...configSheets, targetSheet];
  }

  return {
    configSheets,
    error: null,
  };
};

export {
  customMenu,
  initMenu,
  isSameRow,
  rowAt,
  getConfigSheets,
  getPropertyByName,
  getSheetValues,
  getTargetSheet,
  setDefaultProperty,
};

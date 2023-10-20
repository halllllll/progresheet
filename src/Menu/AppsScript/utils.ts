import { PROPERTY_DEFAULT } from '@/Const';
import { type GASError } from '../errors';
import { initConfig } from './service';

const customMenu = (): void => {
  const html = HtmlService.createHtmlOutputFromFile('menu.html')
    .setWidth(800)
    .setHeight(800);
  SpreadsheetApp.getUi().showModalDialog(html, 'menu');
};

const getPropertyByName = (propertyName: string): string | null => {
  const properties = PropertiesService.getScriptProperties();

  return properties.getProperty(propertyName);
};

const setDefaultProperty = (): void => {
  const properties = PropertiesService.getScriptProperties();
  properties.deleteAllProperties();
  properties.setProperties(PROPERTY_DEFAULT);
};

const initMenu = (): void => {
  const ui = SpreadsheetApp.getUi();
  let btn = ui.alert('初期化します', ui.ButtonSet.OK_CANCEL);
  if (btn === ui.Button.CANCEL) return;
  btn = ui.alert(
    '本当に初期化します。よろしいですか？',
    ui.ButtonSet.OK_CANCEL
  );
  if (btn === ui.Button.CANCEL) return;
  const res = initConfig();
  if (res.success) {
    ui.alert('初期化しました');
  } else {
    ui.alert(
      `初期化に失敗しました。。。\n${res.error.code}\n${res.error.message}`
    );
  }
};

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

type ConfigSheetData = {
  values: string[][];
  error: GASError | null;
};
const getSheetValues = (
  ss: GoogleAppsScript.Spreadsheet.Spreadsheet,
  sheetName: string
): ConfigSheetData => {
  const values = ss
    .getSheetByName(sheetName)
    ?.getDataRange()
    .getDisplayValues();
  if (values === undefined) {
    Logger.log(`sheet "${sheetName}" not found`);

    return {
      error: {
        code: 'SheetNotFound',
        message: `sheet "${sheetName}" not found`,
      },
      values: [],
    };
  } else {
    return {
      error: null,
      values,
    };
  }
};

export {
  customMenu,
  initMenu,
  isSameRow,
  rowAt,
  getPropertyByName,
  getSheetValues,
  setDefaultProperty,
};

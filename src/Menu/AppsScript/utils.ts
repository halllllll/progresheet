import {
  PROPERTY_DEFAULT,
  ss,
  type APP_STATES,
  type PROPERTY_NAMES,
  APP_STATE_PROPERTY_NAME,
} from '@/Const/GAS';
import { CONFIG_SHEET_NAMES } from '@/Const/SheetEnv';
import { type ClassRoom } from '../types';
import { initConfig } from './service';
import { type OperationResult } from './types';

const customMenu = (): void => {
  const html = HtmlService.createHtmlOutputFromFile('menu.html')
    .setWidth(800)
    .setHeight(800);
  SpreadsheetApp.getUi().showModalDialog(html, 'menu');
};

/**
 * return a property by propertyName
 * @param {PROPERTY_NAMES} propertyName
 * @returns {string | null}
 */
const getPropertyByName = (propertyName: PROPERTY_NAMES): string | null => {
  const properties = PropertiesService.getScriptProperties();

  return properties.getProperty(propertyName);
};

/**
 *
 * @param {PROPERTY_NAMES} propertyName
 * @param {string} value
 * @returns {void}
 */
const setPropertyByName = (
  propertyName: PROPERTY_NAMES,
  value: string
): void => {
  const properties = PropertiesService.getScriptProperties();
  properties.setProperty(propertyName, value);
};

const getSheetsBy = (args?: {
  includeNames?: string[];
  excludeNames?: string[];
}): Array<{
  sheet: GoogleAppsScript.Spreadsheet.Sheet;
  name: string;
}> => {
  let sheets = ss.getSheets().map((sheet) => {
    return { sheet, name: sheet.getSheetName() };
  });
  if (!args) return sheets;

  const { includeNames, excludeNames } = args;
  if (!!includeNames && includeNames.length > 0) {
    sheets = sheets.filter(({ name }) => includeNames.includes(name));
  }
  if (!!excludeNames && excludeNames.length > 0) {
    sheets = sheets.filter(({ name }) => !excludeNames.includes(name));
  }

  return sheets;
};

/**
 * @param {APP_STATES} state
 * @returns {void}
 */
const updateAppState = (state: APP_STATES): void => {
  setPropertyByName(APP_STATE_PROPERTY_NAME, state);
};

/**
 * reset and init Properties values
 * @returns {void}
 */
const setDefaultProperty = (): void => {
  const properties = PropertiesService.getScriptProperties();
  properties.deleteAllProperties();
  properties.setProperties(PROPERTY_DEFAULT);
};

/**
 *
 * @returns {Promise<void>}
 */
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

type RowAt = OperationResult<number>;
//  = {
//   index: number;
//   error: GASError | null;
// };
/**
 * find index the target of row
 * @param {string} target
 * @param {Array<string>} row
 * @returns {RowAt}
 */
const rowAt = (target: string, row: string[]): RowAt => {
  const idx = row.indexOf(target);
  // const isExist = row.includes(target);
  if (idx === -1) {
    Logger.log(`not found '${target}' on header`);

    return {
      success: false,
      error: {
        code: 'SheetHeader',
        message: `not found '${target}' on header`,
      },
    };
  }

  return {
    success: true,
    data: row.indexOf(target),
  };
};

type UpdateClassRoomPropertyResult = OperationResult<void>;

/**
 * @param {ClassRoom} data
 * @returns {UpdateClassRoomPropertyResult}
 */
const updateClassRoomProperty = (
  data: ClassRoom
): UpdateClassRoomPropertyResult => {
  try {
    setPropertyByName('CLASSROOM_CLASSNAME', data.name);
    setPropertyByName('CLASSROOM_HEIGHT', data.row.toString());
    setPropertyByName('CLASSROOM_WIDTH', data.column.toString());

    return {
      success: true,
      data: undefined,
    };
  } catch (e: unknown) {
    const err = e as Error;

    return {
      success: false,
      error: {
        code: 'Property',
        message: `${err.name} = ${err.message}`,
      },
    };
  }
};

/**
 * find a sheet named sheetName
 * @param {string} sheetName
 * @returns {GoogleAppsScript.Spreadsheet.Sheet}
 */
const getTargetSheet = (
  sheetName: string
): GoogleAppsScript.Spreadsheet.Sheet | null => {
  const sheets = getSheetsBy({ includeNames: [sheetName] });

  return sheets.length === 0 ? null : sheets[0].sheet;
};

type SheetValues = OperationResult<string[][]>;
/**
 * return the all values at sheet
 * if not found, return error
 * @param sheetName
 * @returns
 */
const getSheetValues = (sheetName: string): SheetValues => {
  // check valid sheet name
  const targetSheet = getTargetSheet(sheetName);
  if (targetSheet === null) {
    Logger.log(`sheet "${sheetName}" not found`);

    return {
      success: false,
      error: {
        code: 'SheetNotFound',
        message: `sheet "${sheetName}" not found`,
      },
    };
  }
  const values = targetSheet.getDataRange().getDisplayValues();

  return {
    success: true,
    data: values,
  };
};

type SheetRangeList = OperationResult<GoogleAppsScript.Spreadsheet.RangeList>;
const getSheetRangeListEveryCells = (
  sheetName: string,
  ...col: number[] // 1 order
): SheetRangeList => {
  const targetSheet = getTargetSheet(sheetName);
  if (targetSheet === null) {
    Logger.log(`sheet "${sheetName}" not found`);

    return {
      success: false,
      error: {
        code: 'SheetNotFound',
        message: `sheet "${sheetName}" not found`,
      },
    };
  }
  const dataRanges = targetSheet.getDataRange();
  const [height, width] = [dataRanges.getNumRows(), dataRanges.getNumColumns()];
  const ranges = Array.from({ length: width }, (_, j) => {
    return Array.from({ length: height }, (_, i) => {
      return `${colNumtoA1(j + 1)}${i + 1}`;
    });
  });

  if (col.length === 0) {
    return {
      success: true,
      data: targetSheet.getRangeList(ranges.flat()),
    };
  }

  return {
    success: true,
    data: targetSheet.getRangeList(
      ranges
        .filter((_, idx) => {
          return col.filter((v) => v >= 1 && v <= width).includes(idx + 1); // zero order
        })
        .flat()
    ),
  };
};

type HideConfigSheetResult = OperationResult<void>;
const hideAllConfigSheet = (): HideConfigSheetResult => {
  try {
    for (const name of CONFIG_SHEET_NAMES) {
      const sheet = getTargetSheet(name);
      if (sheet === null) {
        return {
          success: false,
          error: {
            code: 'SheetNotFound',
            message: `sheet ${name} is not exist`,
          },
        };
      }
      sheet.hideSheet();
    }

    return {
      success: true,
      data: undefined,
    };
  } catch (e: unknown) {
    const err = e as Error;

    return {
      success: false,
      error: {
        code: 'Undefined',
        message: `${err.name} - ${err.message}`,
      },
    };
  }
};

type GetAppState = OperationResult<Exclude<APP_STATES, 'PREPARE'>>;
/**
 * @returns {GetAppState}
 */
const getAppState = (): GetAppState => {
  const appState = getPropertyByName(APP_STATE_PROPERTY_NAME) as APP_STATES;
  if (appState === null) {
    return {
      success: false,
      error: {
        code: 'Property',
        message: `property "${APP_STATE_PROPERTY_NAME}" not found`,
      },
    };
  }
  if (appState === 'PREPARE') {
    return {
      success: false,
      error: {
        code: 'RunningApp',
        message: 'app running now',
      },
    };
  }

  return {
    success: true,
    data: appState,
  };
};

type ConfigSeets = OperationResult<GoogleAppsScript.Spreadsheet.Sheet[]>;
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
        success: false,
        error: {
          code: 'Config',
          message: `${sheetName} not found`,
        },
      };
    }
    configSheets = [...configSheets, targetSheet];
  }

  return {
    success: true,
    data: configSheets,
  };
};

/**
 * @returns {void}
 */
const deleteAllNamedRanges = (): void => {
  const ranges = ss.getNamedRanges();
  for (const range of ranges) {
    range.remove();
  }
};

/**
 * 10進数をA1表記(列)に変換
 * @param {number}  数値
 * @return {string} A1表記
 */
const colNumtoA1 = (d: number): string => {
  if (!Number.isInteger(d)) {
    throw new Error(`${d} is not Integer.`);
  }

  if (d <= 0) {
    throw new Error(`${d} is invalid. should be more than 1.`);
  }
  const alphabets = [
    `A`,
    `B`,
    `C`,
    `D`,
    `E`,
    `F`,
    `G`,
    `H`,
    `I`,
    `J`,
    `K`,
    `L`,
    `M`,
    `N`,
    `O`,
    `P`,
    `Q`,
    `R`,
    `S`,
    `T`,
    `U`,
    `V`,
    `W`,
    `X`,
    `Y`,
    `Z`,
  ];
  const res = [];
  for (; d > 0; d = Math.trunc((d - 1) / 26)) {
    res.push(alphabets[(d - 1) % 26]);
  }

  return res.reverse().join(``);
};

/**
 * A1表記を10進数に変換
 * @param {string} A1表記
 * @return {number} 数値
 */
const a1toColNum = (strCol: string): number => {
  const m = strCol.toString().match(/^([a-zA-Z]+?)+/g);
  if (!m || m.length !== 1) {
    throw new Error(
      `${strCol} is invalid, it's not alphabet sequence by head.`
    );
  }
  strCol = m[0];
  let iNum = 0;
  let temp = 0;

  strCol = strCol.toUpperCase(); // Asciiコードで計算するので
  for (let i = strCol.length - 1; i >= 0; i--) {
    temp = strCol.charCodeAt(i) - 65; // 現在の文字番号;
    if (i !== strCol.length - 1) {
      temp = (temp + 1) * Math.pow(26, i + 1);
    }
    iNum = iNum + temp;
  }

  return iNum;
};

/**
 * @returns {string}
 */
const MMddHHmmss = (): string => {
  return Utilities.formatDate(new Date(), 'JST', 'MM_dd_HHmmss');
};

export {
  a1toColNum,
  colNumtoA1,
  customMenu,
  deleteAllNamedRanges,
  hideAllConfigSheet,
  getAppState,
  getConfigSheets,
  getPropertyByName,
  getSheetRangeListEveryCells,
  getSheetsBy,
  getSheetValues,
  getTargetSheet,
  initMenu,
  isSameRow,
  MMddHHmmss,
  rowAt,
  setDefaultProperty,
  updateAppState,
  updateClassRoomProperty,
};

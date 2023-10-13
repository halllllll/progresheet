import {
  ss,
  CONFIG_SHEET,
  CONFIG_DEFAULT,
  CONFIG_HEADER,
  CONFIG_DEFAULT_COLUMN_OFFSET,
  CONFIG_DEFAULT_ROW_OFFSET,
  CONFIG_LABEL,
  CONFIG_COLOR,
  PROPERTY_WIDTH,
  PROPERTY_HEIGHT,
} from '@/Const';
import { type LabelData } from '../components/menuParts/labels/labels';
import {
  ConfigSheetError,
  type GASError,
  UndefinedServerError,
} from '../errors';
import { type Editor, type ClassRoom, type Labels } from '../types';
import { getPropertyByName, setDefaultProperty } from './utils';

/**
 * just return user acount id
 * @returns {string} userd - accessed user id
 */
const getId = (): string => {
  const userid = Session.getActiveUser().getEmail();
  console.log(`get id: ${userid}`);

  return userid;
};

const getUserInfo = (): string => {
  return getId();
};

/**
 * just return spreadsheet name
 * @returns {string} name of SpreadSheet
 */
const getSpreadSheetName = (): string => {
  const sheetname = ss.getName();

  return sheetname;
};

/**
 * protection check for `CONFIG_SHEET`
 * @param {string} id - target account id
 * @returns {boolean}
 */
const _isAllowedConfigSheet = (id: string): boolean => {
  try {
    const configSheet = getTargetSheet(CONFIG_SHEET);
    if (configSheet === null)
      throw new ConfigSheetError(`sheet ${CONFIG_SHEET} is not found`);
    const prot = configSheet.protect();
    const editors = prot.getEditors();

    // Apps ScriptではES6までしか対応してないので、たぶんincludesは使えない気がする
    // return editors.map((editor) => editor.getEmail()).includes(id);
    return editors.map((editor) => editor.getEmail()).includes(id);
  } catch (e: unknown) {
    // TODO: error handling
    console.log(`error occured! at isAllowedConfigSheet`);
    Logger.log(e);

    return false;
  }
};

export type ConfigProtectData =
  | {
      success: true;
      editors: Editor[];
    }
  | {
      success: false;
      error: Error;
      errMsg: string;
    };

const getConfigProtectData = (): ConfigProtectData => {
  try {
    const configSheet = getTargetSheet(CONFIG_SHEET);
    if (configSheet === null)
      throw new UndefinedServerError(`${CONFIG_SHEET} not found`);
    const spreadSheetEditors = ss.getEditors().map((user) => user.getEmail());
    console.log(`spreadsheet editors: ${spreadSheetEditors.join(', ')}`);

    const protect = configSheet.protect();

    const protectorAccounts = protect
      .getEditors()
      .map((user) => user.getEmail());
    console.log(`accounts: ${protectorAccounts.join(', ')}`);
    const editors = spreadSheetEditors.map((id): Editor => {
      return {
        id,
        // eslint-disable-next-line no-unneeded-ternary, @typescript-eslint/prefer-includes
        editable: protectorAccounts.indexOf(id) === -1 ? false : true,
      };
    });

    return {
      success: true,
      editors,
    };
  } catch (e: unknown) {
    console.log('エラーだぜ！');
    console.log(e);
    if (e instanceof UndefinedServerError) {
      return {
        success: false,
        error: e,
        errMsg: 'sheet not found',
      };
    } else {
      const err = e as Error;

      return {
        success: false,
        error: err,
        errMsg: `${err.name}\n${err.message}\nundefined error occured at "getConfigProtectData"`,
      };
    }
  }
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
      error: GASError;
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

interface InitOptions {
  withEditors?: boolean;
}
/**
 * initialize sheet. set default values for `CONFIG_SHEET`
 * @returns {InitResponse}
 */
const initConfig = (options: InitOptions = {}): InitResponse => {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10 * 1000);
    const target = getTargetSheet(CONFIG_SHEET);
    let configSheet: GoogleAppsScript.Spreadsheet.Sheet | null = null;

    /**
     * reset spreadsheet sequence
     */
    if (target === null) {
      configSheet = ss.insertSheet(0);
      configSheet.setName(CONFIG_SHEET);
    } else {
      configSheet = target;
      configSheet.clear().clearNotes();
    }

    /**
     * fixed header and default values
     */
    configSheet.setFrozenRows(1);

    const range = configSheet.getRange(
      CONFIG_DEFAULT_ROW_OFFSET,
      CONFIG_DEFAULT_COLUMN_OFFSET,
      CONFIG_DEFAULT.length,
      CONFIG_DEFAULT[0].length
    );
    range.setValues(CONFIG_DEFAULT);

    /**
     * BG Color (based column B)
     * (1, 1) -> (header回避1->2へ移動, A->Bへ移動)
     */
    const colorRange = range.offset(1, 1, CONFIG_DEFAULT.length - 1, 1);
    console.log('values:\n', colorRange.getValues());
    setBG(colorRange);

    /**
     * （取得した時点での）設定シート以外全部削除
     */
    const sheets = ss.getSheets();
    for (const sheet of sheets) {
      if (sheet.getName() !== configSheet.getName()) ss.deleteSheet(sheet);
    }

    /**
     * sheets protection sequence
     */
    const prot = configSheet.protect();
    prot.setDescription('設定シート');
    prot.removeEditors(prot.getEditors());
    if (options.withEditors === true) {
      prot.addEditors(ss.getEditors().map((user) => user.getEmail()));
    }
    prot.addEditor(getId());
    // configSheet.hideSheet();

    /**
     * delete and set default all properties
     */
    setDefaultProperty();

    return { success: true };
  } catch (e: unknown) {
    Logger.log(e);
    const err = e as Error;

    return {
      success: false,
      error: {
        code: 'Undefined',
        message: `[${err.name}] - ${err.message}`,
      },
    };
  } finally {
    lock.releaseLock();
  }
};

/**
 * ラベル取得・設定
 */
export type LabelResponse =
  | { success: true; body: Labels }
  | { success: false; error: GASError };
/**
 *
 * @returns {LabelResponse}
 */
const getLabelConfig = (): LabelResponse => {
  try {
    const values = ss
      .getSheetByName(CONFIG_SHEET)
      ?.getDataRange()
      .getDisplayValues();
    if (values === undefined) {
      Logger.log('config sheet not found');

      return {
        success: false,
        error: {
          code: 'ConfigSheet',
          message: 'config sheet not found',
        },
      };
    }
    for (let i = 0; i < values[0].length; i++) {
      if (values[0][i] !== CONFIG_HEADER[i]) {
        console.log(`header: ${CONFIG_HEADER.join(', ')}`);
        console.log(`value: ${values[0].join(', ')}`);
        Logger.log('invalid header config sheet');

        return {
          success: false,
          error: {
            code: 'ConfigSheet',
            message: `invalid header config sheet.\n
            expected header is [${CONFIG_HEADER.join(', ')}](length: ${
              CONFIG_HEADER.length
            }) but current sheet has [${values[0].join(', ')}] (length: ${
              values[0].length
            }).`,
          },
        };
      }
    }
    const labelIdx = values[0].indexOf(CONFIG_LABEL);
    if (labelIdx === -1) {
      Logger.log(`not found '${CONFIG_LABEL}' on header`);

      return {
        success: false,
        error: {
          code: 'ConfigSheet',
          message: `not found '${CONFIG_LABEL}' on header`,
        },
      };
    }
    const colorIdx = values[0].indexOf(CONFIG_COLOR);
    if (colorIdx === -1) {
      Logger.log(`not found '${CONFIG_COLOR}' on header`);

      return {
        success: false,
        error: {
          code: 'ConfigSheet',
          message: `not found '${CONFIG_COLOR}' on header`,
        },
      };
    }

    return {
      success: true,
      body: {
        labels: values.map((d) => d[labelIdx]).slice(1),
        colors: values.map((d) => d[colorIdx]).slice(1),
      },
    };
  } catch (e: unknown) {
    Logger.log(e);
    const err = e as Error;

    return {
      success: false,
      error: {
        code: 'Undefined',
        message: `[${err.name}] - ${err.message}`,
      },
    };
  }
};

export type SetLabelResponse =
  | {
      success: true;
      body: Labels;
    }
  | {
      success: false;
      error: Error;
      errMsg: string;
    };
/**
 *
 * @param {string} data - comming as stringified object data, by "JSON.stringify"
 * @returns
 */
const setLabelConfig = (data: string): SetLabelResponse => {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(1 * 3000);
    const targetSheet = getTargetSheet(CONFIG_SHEET);
    if (targetSheet === null)
      throw new Error(`sheet ${CONFIG_SHEET} is not found`);
    const d = JSON.parse(data) as LabelData;
    console.log(`data from front:`);
    console.log(`row string: ${data}`);
    console.log(d);
    const values = [CONFIG_HEADER, ...d.labels.map((v) => [v.value, v.color])];
    // 今の設定を削除
    let range = targetSheet.getDataRange();
    range.clear();

    range = targetSheet.getRange(
      CONFIG_DEFAULT_ROW_OFFSET,
      CONFIG_DEFAULT_COLUMN_OFFSET,
      values.length,
      values[0].length
    );
    range.setValues(values);
    const colorRange = range.offset(1, 1, values.length - 1, 1);
    setBG(colorRange);

    // 新たに取得したものを返す
    const labelData = getLabelConfig();
    if (labelData.success) {
      return { success: true, body: labelData.body };
    } else {
      throw new ConfigSheetError("label data can't get!");
    }
  } catch (e: unknown) {
    console.log('error occured on "setLabelConfig"');
    console.log(e);
    console.log(JSON.stringify(e));
    const err = e as Error;

    return { success: false, error: err, errMsg: err.message };
  } finally {
    lock.releaseLock();
  }
};

/**
 * 教室データ width, height
 */
export type ClassRoomResponse =
  | { success: true; body: ClassRoom }
  | { success: false; error: GASError };
/**
 * Class room data, include `ClassRoom`
 * When something error occured during taking ClassRoom data,
 * `false` should be returned.
 * @returns {ClassRoomResponse}
 */
const getClassRoomConfig = (): ClassRoomResponse => {
  try {
    const width = getPropertyByName(PROPERTY_WIDTH);
    const height = getPropertyByName(PROPERTY_HEIGHT);

    if (width === null || height === null) {
      Logger.log('property not found');

      return {
        success: false,
        error: {
          code: 'Property',
          message: 'property not found',
        },
      };
    }

    return {
      success: true,
      body: {
        column: height,
        row: width,
      },
    };
  } catch (e: unknown) {
    Logger.log(e);
    const err = e as UndefinedServerError;

    return {
      success: false,
      error: {
        code: 'Undefined',
        message: `[${err.name}] - ${err.message}`,
      },
    };
  }
};

export {
  getId,
  getUserInfo,
  getSpreadSheetName,
  getClassRoomConfig,
  initConfig,
  getLabelConfig,
  setLabelConfig,
  _isAllowedConfigSheet, // TODO: 未使用
  getConfigProtectData,
};

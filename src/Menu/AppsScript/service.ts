import { ss } from '@/Const/GAS';
import { ENV_LABEL } from '@/Const/Label';
import { ENV_SEAT } from '@/Const/Seat';
import { CONFIG_SHEET_NAMES } from '@/Const/SheetEnv';

import { type LabelData } from '../components/menuParts/labels/labels';
import {
  ConfigError,
  UndefinedServerError,
  type GASError,
  InitError,
} from '../errors';
import {
  type Editor,
  type ClassRoom,
  type Labels,
  type EditorRequest,
  type Seat,
} from '../types';
import * as Utils from './utils';
import { getTargetSheet } from './utils';

/**
 * just return user acount id
 * @returns {string} userd - accessed user id
 */
const getId = (): string => {
  const userid = Session.getActiveUser().getEmail();
  console.log(`get id: ${userid}`);

  return userid;
};

// TODO: そのうちid以外にも取得する用
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

// TODO: 不要かも
/**
 * protection check for `CONFIG_SHEET`
 * @param {string} id - target account id
 * @returns {boolean}
 */
const _isAllowedConfigSheet = (id: string): boolean => {
  try {
    const configSheet = getTargetSheet(ENV_LABEL.NAME);
    if (configSheet === null)
      throw new ConfigError(`sheet ${ENV_LABEL.NAME} is not found`);
    const prot = configSheet.protect();
    const editors = prot.getEditors();

    // Apps ScriptではES6までしか対応してないので、たぶんincludesは使えない気がする
    // eslint-disable-next-line no-unneeded-ternary, @typescript-eslint/prefer-includes
    return editors.map((editor) => editor.getEmail()).indexOf(id) !== -1
      ? true
      : false;
  } catch (e: unknown) {
    // TODO: error handling
    console.log(`error occured! at isAllowedConfigSheet`);
    Logger.log(e);

    return false;
  }
};

/**
 * 設定シートの保護データ情報
 */
export type ConfigProtectData =
  | {
      success: true;
      editors: Editor[];
    }
  | {
      success: false;
      error: GASError;
    };
/**
 * `CONFIG_SHEET` protection data (editable-user, editable-permission)
 * @returns {ConfigProtectData}
 */
const getConfigProtectData = (): ConfigProtectData => {
  try {
    // TODO: config_sheetは配列なのであとでちゃんとやる とりあえず従来の設定シートのみ
    /* exist check for CONFIG_SHEET */
    const configSheet = getTargetSheet(CONFIG_SHEET_NAMES[0]);
    if (configSheet === null) {
      return {
        success: false,
        error: {
          code: 'Config',
          message: `${CONFIG_SHEET_NAMES[0]} not found`,
        },
      };
    }
    const spreadSheetEditors = ss.getEditors().map((user) => user.getEmail());
    console.log(`spreadsheet editors: ${spreadSheetEditors.join(', ')}`);

    const protect = configSheet.protect();
    if (!protect.canEdit()) {
      return {
        success: false,
        error: {
          code: 'Permission',
          message: `you've NO permission for editting "${CONFIG_SHEET_NAMES[0]}", and getting data`,
        },
      };
    }
    const protectorAccounts = protect
      .getEditors()
      .map((user) => user.getEmail());
    console.log(`accounts: ${protectorAccounts.join(', ')}`);
    const editors = spreadSheetEditors.map((id): Editor => {
      return {
        useId: id,
        // eslint-disable-next-line no-unneeded-ternary, @typescript-eslint/prefer-includes
        editable: protectorAccounts.indexOf(id) === -1 ? false : true,
      };
    });

    return {
      success: true,
      editors,
    };
  } catch (e: unknown) {
    const err = e as Error;
    console.log(err);

    return {
      success: false,
      error: {
        code: 'Undefined',
        message: `[${err.name}] - ${err.message}\nundefined error occured at "getConfigProtectData"`,
      },
    };
  }
};

/**
 * update `CONFIG_SHEET` protection from user data.
 * @param {string} data - interpretated as `Editor[]`
 * @returns {ConfigProtectData} - just call `getConfigProtectData`
 */
const setConfigProtection = (data: string): ConfigProtectData => {
  try {
    // TODO CONFIG_SHEETは複数の設定シート全部 とりあえず今は最初だけやる
    const configSheet = getTargetSheet(CONFIG_SHEET_NAMES[0]);
    if (configSheet === null) {
      return {
        success: false,
        error: {
          code: 'Config',
          message: `${CONFIG_SHEET_NAMES[0]} not found`,
        },
      };
    }

    // update config protection
    // 編集権限かつ送信されたユーザーに対して

    /**
     * しゃーなしで as Editor[]
     */
    const d = JSON.parse(data) as EditorRequest;
    console.log(`data from front:`);
    console.log(`row string: ${data}`);
    console.log(d);

    const spreadSheetEditors = new Set(
      ss.getEditors().map((user) => user.getEmail())
    );
    const requestEditors = [
      ...new Set(
        d.editors
          .filter((editor) => editor.editable)
          .map((editor) => editor.useId)
      ),
    ];
    const updateEditors = requestEditors.filter((editor) =>
      spreadSheetEditors.has(editor)
    );

    const prot = configSheet.protect();
    prot.setDescription('設定シート');
    prot.removeEditors(prot.getEditors());
    prot.addEditor(getId()); // 自身は例外とする（一応）
    console.log(
      `add editors to protected sheet -> ${updateEditors.join(', ')}`
    );
    prot.addEditors(updateEditors);

    return getConfigProtectData();
  } catch (e: unknown) {
    const err = e as Error;
    console.log(e);

    return {
      success: false,
      error: {
        code: 'Undefined',
        message: `[${err.name}] = ${err.message}`,
      },
    };
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
 * init LabelSheet, if not exist, create with default value. if exist,  clear all value and fill default value.
 *
 * @returns {{error: GASError} | {error: null, sheet: GoogleAppsScript.Spreadsheet.Sheet} }
 */
const initLabelSheet = ():
  | {
      error: GASError;
    }
  | {
      error: null;
      sheet: GoogleAppsScript.Spreadsheet.Sheet;
    } => {
  const lock = LockService.getScriptLock();
  lock.waitLock(10 * 1000);
  try {
    const targetSheet = getTargetSheet(ENV_LABEL.NAME);
    let configSheet: GoogleAppsScript.Spreadsheet.Sheet | null = null;

    /**
     * reset spreadsheet sequence
     */
    if (targetSheet === null) {
      configSheet = ss.insertSheet(0); // on first sheet
      configSheet.setName(ENV_LABEL.NAME);
    } else {
      configSheet = targetSheet;
      configSheet.clear().clearNotes();
    }

    /**
     * fixed header and default values
     */
    configSheet.setFrozenRows(1);

    const range = configSheet.getRange(
      ENV_LABEL.OFFSET_ROW,
      ENV_LABEL.OFFSET_COL,
      ENV_LABEL.DEFAULT_VALUES.length + 1, // body + header(1 row)
      ENV_LABEL.HEADER.size
    );
    range.setValues([
      Array.from(ENV_LABEL.HEADER.values()),
      ...ENV_LABEL.DEFAULT_VALUES,
    ]);

    /**
     * BG Color (based column B)
     * (1, 1) -> (header回避1->2へ移動, A->Bへ移動)
     */
    const colorRange = range.offset(
      1,
      1,
      ENV_LABEL.DEFAULT_VALUES.length, // default valueの数ぶんの高さ
      1
    );
    console.log('values:\n', colorRange.getValues());
    setBG(colorRange);

    return { sheet: configSheet, error: null };
  } catch (e: unknown) {
    Logger.log(e);
    const err = e as Error;

    return {
      error: {
        code: 'Undefined',
        message: `[${err.name}] - ${err.message}`,
        options: {
          cause: new InitError(),
          details: 'initLabelSheet',
        },
      },
    };
  } finally {
    lock.releaseLock();
  }
};

const initSeatListSheet = ():
  | {
      error: GASError;
    }
  | {
      error: null;
      sheet: GoogleAppsScript.Spreadsheet.Sheet;
    } => {
  const lock = LockService.getScriptLock();
  lock.waitLock(10 * 1000);
  try {
    const targetSheet = getTargetSheet(ENV_SEAT.NAME);
    let configSheet: GoogleAppsScript.Spreadsheet.Sheet | null = null;

    /**
     * reset spreadsheet sequence
     */
    if (targetSheet === null) {
      configSheet = ss.insertSheet(1); // on second sheet
      configSheet.setName(ENV_SEAT.NAME);
    } else {
      configSheet = targetSheet;
      configSheet.clear().clearNotes();
    }

    /**
     * fixed header and default values
     */
    configSheet.setFrozenRows(1);

    const range = configSheet.getRange(
      ENV_SEAT.OFFSET_ROW,
      ENV_SEAT.OFFSET_COL,
      ENV_SEAT.DEFAULT_VALUES.length + 1,
      ENV_SEAT.HEADER.size
    );

    range.setValues([
      Array.from(ENV_SEAT.HEADER.values()),
      ...ENV_SEAT.DEFAULT_VALUES.map((v) => [v.index, v.name, v.visible]),
    ]);

    return { sheet: configSheet, error: null };
  } catch (e: unknown) {
    Logger.log(e);
    const err = e as Error;

    return {
      error: {
        code: 'Undefined',
        message: `[${err.name}] - ${err.message}`,
        options: {
          cause: new InitError(),
          details: 'initSeatSheet',
        },
      },
    };
  } finally {
    lock.releaseLock();
  }
};

export type InitOptions = {
  withEditors?: boolean;
};
/**
 * initialize sheet. set default values for `CONFIG_SHEET`
 * @returns {InitResponse}
 */
const initConfig = async (options: InitOptions = {}): Promise<InitResponse> => {
  console.log(`options: ${JSON.stringify(options)}`);

  try {
    // TODO: まずラベル設定シートだけ考える あとでそれぞれのInitSheetに対してPromiseしてPromise.allする予定
    const results = await Promise.all([
      Promise.resolve(initLabelSheet()),
      Promise.resolve(initSeatListSheet()),
    ]).catch((e: Error) => {
      Logger.log(e);
      throw new UndefinedServerError(e.name);
    });

    const configSheets: GoogleAppsScript.Spreadsheet.Sheet[] = [];
    for (const result of results) {
      if (result.error !== null) {
        return {
          success: false,
          error: result.error,
        };
      }
      configSheets.push(result.sheet);
    }
    /**
     * （取得した時点での）設定シート[以外]全部削除
     */
    for (const sheet of ss.getSheets()) {
      if (
        // GASはES6で止まってるのでincludesは使えないきがする
        // eslint-disable-next-line @typescript-eslint/prefer-includes
        CONFIG_SHEET_NAMES.map((val) => val as string).indexOf(
          sheet.getName()
        ) === -1
      ) {
        ss.deleteSheet(sheet);
      }
    }

    /**
     * sheets protection sequence
     */
    for (const sheet of configSheets) {
      const prot = sheet.protect();
      prot.setDescription('設定シート');
      prot.removeEditors(prot.getEditors());
      if (options.withEditors === true) {
        prot.addEditors(ss.getEditors().map((user) => user.getEmail()));
      }
      prot.addEditor(getId());
      // sheet.hideSheet();
    }

    /**
     * delete and set default all properties
     */
    Utils.setDefaultProperty();

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
  }
};

/** -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 *
 * ラベル取得・設定
 *
 * *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 */

type LabelInfo =
  | {
      error: GASError;
    }
  | {
      error: null;
      labelIdx: number;
      colorIdx: number;
    };
/**
 * めんどくさいので処理をまとめたが、逆にわかりにくい可能性ある
 *
 * @param {string[]} header
 * @returns {LabelInfo}
 */
const labelInfo = (header: string[]): LabelInfo => {
  // header check
  if (!Utils.isSameRow(header, Array.from(ENV_LABEL.HEADER.values()))) {
    console.log(`header: ${Array.from(ENV_LABEL.HEADER.values()).join(', ')}`);
    console.log(`value: ${header.join(', ')}`);
    Logger.log('invalid header config sheet');

    return {
      error: {
        code: 'SheetHeader',
        message: `invalid header config sheet.\n
              expected header is [${Array.from(ENV_LABEL.HEADER.values()).join(
                ', '
              )}}](length: ${
          Array.from(ENV_LABEL.HEADER.values()).length
        }) but current sheet has [${header.join(', ')}] (length: ${
          header.length
        }).`,
      },
    };
  }

  const labelRes = Utils.rowAt(ENV_LABEL.HEADER.get(0) as string, header);
  if (labelRes.error !== null) {
    return { error: labelRes.error };
  }
  const colorRes = Utils.rowAt(ENV_LABEL.HEADER.get(1) as string, header);
  if (colorRes.error !== null) {
    return { error: colorRes.error };
  }

  return {
    error: null,
    colorIdx: colorRes.index,
    labelIdx: labelRes.index,
  };
};

export type LabelResponse =
  | { success: true; body: Labels }
  | { success: false; error: GASError };
/**
 * return label values
 * @returns {LabelResponse}
 */
const getLabelConfig = (): LabelResponse => {
  try {
    // sheet check and get values
    const sheetValue = Utils.getSheetValues(ss, ENV_LABEL.NAME);

    if (sheetValue.error !== null) {
      return {
        success: false,
        error: sheetValue.error,
      };
    }

    // いろいろ混ぜたやつ
    const labelInfoValue = labelInfo(sheetValue.values[0]);
    if (labelInfoValue.error !== null) {
      return {
        success: false,
        error: labelInfoValue.error,
      };
    }

    return {
      success: true,
      body: {
        labels: sheetValue.values
          .map((d) => d[labelInfoValue.labelIdx])
          .slice(1),
        colors: sheetValue.values
          .map((d) => d[labelInfoValue.colorIdx])
          .slice(1),
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
      error: GASError;
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
    const targetSheet = getTargetSheet(ENV_LABEL.NAME);
    if (targetSheet === null) {
      return {
        success: false,
        error: {
          code: 'Config',
          message: `sheet ${ENV_LABEL.NAME} is not found`,
        },
      };
    }
    // しょうがないのでas
    const d = JSON.parse(data) as LabelData;
    console.log(`data from front:`);
    console.log(`row string: ${data}`);
    console.log(d);
    const values = [
      Array.from(ENV_LABEL.HEADER.values()),
      ...d.labels.map((v) => [v.value, v.color]),
    ];
    // 今の設定を削除
    let range = targetSheet.getDataRange();
    range.clear();

    range = targetSheet.getRange(
      ENV_LABEL.OFFSET_ROW,
      ENV_LABEL.OFFSET_COL,
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
      return labelData; // エラー時のレスポンスデータの構造が同じなので
    }
  } catch (e: unknown) {
    console.log('error occured on "setLabelConfig"');
    console.log(e);
    const err = e as Error;

    return {
      success: false,
      error: {
        code: 'UpdateLabel',
        message: `[${err.name}] - ${err.message}`,
      },
    };
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
    const width = Utils.getPropertyByName('CLASSROOM_WIDTH');
    const height = Utils.getPropertyByName('CLASSROOM_HEIGHT');
    const name = Utils.getPropertyByName('CLASSROOM_CLASSNAME');

    if (width === null || height === null || name === null) {
      Logger.log(`name: ${name ?? 'omg'}`);
      Logger.log(`height: ${height ?? 'omg'}`);
      Logger.log(`width: ${width ?? 'omg'}`);

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
        name,
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

type SeatSheetRespone =
  | { success: true; body: Seat[] }
  | { success: false; error: GASError };

const getClassRoomSeatData = (): SeatSheetRespone => {
  try {
    const targetSheet = getTargetSheet(ENV_SEAT.NAME);
    if (targetSheet === null) {
      return {
        success: false,
        error: {
          code: 'Config',
          message: `sheet ${ENV_SEAT.NAME} is not found`,
        },
      };
    }
    const sheetValues = Utils.getSheetValues(ss, ENV_SEAT.NAME);
    if (sheetValues.error !== null) {
      return {
        success: false,
        error: sheetValues.error,
      };
    }

    // バリデーションチェック 規定ヘッダと設定されてるヘッダーの値の比較
    if (
      sheetValues.values[0].length !== ENV_SEAT.HEADER.size ||
      !sheetValues.values[0].every(
        (v, i) => v === Array.from(ENV_SEAT.HEADER.values())[i]
      )
    ) {
      Logger.log(
        `expected ${ENV_SEAT.NAME} header is [${Array.from(
          ENV_SEAT.HEADER.values()
        ).join(',')}], but current value is [${sheetValues.values[0].join(
          ','
        )}]`
      );

      return {
        success: false,
        error: {
          code: 'SheetHeader',
          message: `expected ${ENV_SEAT.NAME} header is [${Array.from(
            ENV_SEAT.HEADER.values()
          ).join(',')}], but current value is [${sheetValues.values[0].join(
            ','
          )}]`,
        },
      };
    }
    let ret: Seat[] = [];

    for (const val of sheetValues.values.slice(1)) {
      if (val.length !== ENV_SEAT.HEADER.size) {
        // バリデーションチェック 規定ヘッダとrowの長さ・要素の比較
        return {
          success: false,
          error: {
            code: 'InvalidValue',
            message: 'not same length header and body',
          },
        };
      } else if (!Number.isInteger(parseInt(val[0]))) {
        // バリデーションチェック 1つ目の要素`Index`はnumber
        return {
          success: false,
          error: {
            code: 'InvalidValue',
            message: `value ${val[0]} should be Interger`,
          },
        };
      } else if (val[1] === '') {
        // バリデーションチェック 2つ目の要素`name`は NOT empty
        return {
          success: false,
          error: {
            code: 'InvalidValue',
            message: `${val[1]} should be NOT empty`,
          },
        };
      } else if (val[2] !== 'TRUE' && val[2] !== 'FALSE') {
        // バリデーションチェック 3つ目の要素はTRUE or FALSE(Sheet上では文字列)
        return {
          success: false,
          error: {
            code: 'InvalidValue',
            message: `${val[2]} should be TRUE' or 'FALSE'`,
          },
        };
      }
      ret = [
        {
          index: parseInt(val[0]),
          name: val[1],
          visible: val[2] === 'TRUE',
        },
        ...ret,
      ];
    }

    return {
      success: true,
      body: ret,
    };

    // ok
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
  getClassRoomSeatData,
  initConfig,
  getLabelConfig,
  setLabelConfig,
  _isAllowedConfigSheet, // TODO: 未使用
  getConfigProtectData,
  setConfigProtection,
};

import { ss } from '@/Const/GAS';
import { ENV_LABEL } from '@/Const/Label';
import { ENV_SEAT } from '@/Const/Seat';
import { ENV_SEATS_SHEET } from '@/Const/SeatsSheet';
import { type CONFIG_SHEET, CONFIG_SHEET_NAMES } from '@/Const/SheetEnv';

import { ENV_VIEW } from '@/Const/View';
import { type LabelData } from '../components/menuParts/labels/labels';
import { ConfigError, UndefinedServerError, InitError } from '../errors';
import {
  type Editor,
  type ClassRoom,
  type Labels,
  type EditorRequest,
  type Seat,
  type ClassLayout,
} from '../types';
import { type OperationResult } from './types';
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
    return editors.map((editor) => editor.getEmail()).includes(id);
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
type ConfigProtectData = OperationResult<Editor[]>;
/**
 * `CONFIG_SHEET` protection data (editable-user, editable-permission)
 * @returns {ConfigProtectData}
 */
const getConfigProtectData = (configSheet: CONFIG_SHEET): ConfigProtectData => {
  try {
    /* exist check for CONFIG_SHEET */
    // TODO: 引数configSheetsに対してのPromise.all
    const targetConfigSheet = getTargetSheet(configSheet);
    if (targetConfigSheet === null) {
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

    const protect = targetConfigSheet.protect();
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
        editable: !!protectorAccounts.includes(id),
      };
    });

    return {
      success: true,
      data: editors,
    };
  } catch (e: unknown) {
    const err = e as Error;
    console.log(err);

    return {
      success: false,
      error: {
        code: 'Undefined',
        name: err.name,
        message: `[${err.message}\nundefined error occured at "getConfigProtectData"`,
      },
    };
  }
};

/**
 * update all `CONFIG_SHEET` protections from user data.
 * @param {string} data - interpretated as `Editor[]`
 * @returns {ConfigProtectData} - just call `getConfigProtectData`
 */
const setAllConfigProtections = (data: string): ConfigProtectData => {
  try {
    /**
     * しゃーなしで as Editor[]
     */
    const d = JSON.parse(data) as EditorRequest;
    console.log(`data from front:`);
    console.log(`row string: ${data}`);
    console.log(d);
    const result = Utils.getConfigSheets();
    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

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

    for (const configSheet of result.data) {
      const prot = configSheet.protect();
      prot.setDescription('設定シート');
      prot.removeEditors(prot.getEditors());
      prot.addEditor(getId()); // 自身は例外とする（一応）
      console.log(
        `add editors to protected sheet -> ${updateEditors.join(', ')}`
      );
      prot.addEditors(updateEditors);
    }

    // TODO: 適当に一つだけ返してるのを直したいがうまい取り回しがわからない
    return getConfigProtectData('ラベル設定');
  } catch (e: unknown) {
    const err = e as Error;
    console.log(e);

    return {
      success: false,
      error: {
        code: 'Undefined',
        name: err.name,
        message: err.message,
      },
    };
  }
};

/**
 * 設定シートのデフォルトリスト
 * A列 ラベル名
 * B列 背景色（16進数）
 */

export type InitResponse = OperationResult<void>;

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

type initLabelSheetReponse =
  OperationResult<GoogleAppsScript.Spreadsheet.Sheet>;

/**
 * init LabelSheet, if not exist, create with default value. if exist,  clear all value and fill default value.
 *
 * @returns {initLabelSheetReponse}
 */
const initLabelSheet = (): initLabelSheetReponse => {
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

    return { success: true, data: configSheet };
  } catch (e: unknown) {
    Logger.log(e);
    const err = e as Error;

    return {
      success: false,
      error: {
        code: 'Undefined',
        name: err.name,
        message: err.message,
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

type initSeatListSheetResponse =
  OperationResult<GoogleAppsScript.Spreadsheet.Sheet>;

const initSeatListSheet = (): initSeatListSheetResponse => {
  const lock = LockService.getScriptLock();
  lock.waitLock(10 * 1000);
  try {
    const targetSheet = getTargetSheet(ENV_SEATS_SHEET.NAME);
    let configSheet: GoogleAppsScript.Spreadsheet.Sheet | null = null;

    /**
     * reset spreadsheet sequence
     */
    if (targetSheet === null) {
      configSheet = ss.insertSheet(1); // on second sheet
      configSheet.setName(ENV_SEATS_SHEET.NAME);
    } else {
      configSheet = targetSheet;
      configSheet.clear().clearNotes();
    }

    /**
     * fixed header and default values
     */
    configSheet.setFrozenRows(1);

    const range = configSheet.getRange(
      ENV_SEATS_SHEET.OFFSET_ROW,
      ENV_SEATS_SHEET.OFFSET_COL,
      ENV_SEATS_SHEET.DEFAULT_VALUES.length + 1,
      ENV_SEATS_SHEET.HEADER.size
    );

    range.setValues([
      Array.from(ENV_SEATS_SHEET.HEADER.values()),
      ...ENV_SEATS_SHEET.DEFAULT_VALUES.map((v) => [
        v.index,
        v.name,
        v.visible,
      ]),
    ]);

    return { success: true, data: configSheet };
  } catch (e: unknown) {
    Logger.log(e);
    const err = e as Error;

    return {
      success: false,
      error: {
        code: 'Undefined',
        name: err.name,
        message: err.message,
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
    const results = await Promise.all([
      Promise.resolve(initLabelSheet()),
      Promise.resolve(initSeatListSheet()),
    ]).catch((e: Error) => {
      Logger.log(e);
      throw new UndefinedServerError(e.name);
    });

    const configSheets: GoogleAppsScript.Spreadsheet.Sheet[] = [];
    for (const result of results) {
      if (!result.success) {
        return {
          success: false,
          error: result.error,
        };
      }
      configSheets.push(result.data);
    }
    /**
     * （取得した時点での）設定シート[以外]全部削除
     */
    for (const sheetObj of Utils.getSheetsBy()) {
      if (
        // TODO: 本当? <- GASはES6で止まってるのでincludesは使えないきがする
        !CONFIG_SHEET_NAMES.map((val) => val as string).includes(sheetObj.name)
      ) {
        ss.deleteSheet(sheetObj.sheet);
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

    return { success: true, data: undefined };
  } catch (e: unknown) {
    Logger.log(e);
    const err = e as Error;

    return {
      success: false,
      error: {
        code: 'Undefined',
        name: err.name,
        message: err.message,
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

type LabelInfo = OperationResult<{ labelIdx: number; colorIdx: number }>;
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
      success: false,
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
  if (!labelRes.success) {
    return labelRes;
  }
  const colorRes = Utils.rowAt(ENV_LABEL.HEADER.get(1) as string, header);
  if (!colorRes.success) {
    return colorRes;
  }

  return {
    success: true,
    data: {
      colorIdx: colorRes.data,
      labelIdx: labelRes.data,
    },
  };
};

type LabelResponse = OperationResult<Labels>;
/**
 * return label values
 * @returns {LabelResponse}
 */
const getLabelConfig = (): LabelResponse => {
  try {
    // sheet check and get values
    const sheetValue = Utils.getSheetValues(ENV_LABEL.NAME);

    if (!sheetValue.success) {
      return {
        success: false,
        error: sheetValue.error,
      };
    }

    // いろいろ混ぜたやつ
    const values = sheetValue.data;
    const labelInfoValue = labelInfo(values[0]);
    if (!labelInfoValue.success) {
      return {
        success: false,
        error: labelInfoValue.error,
      };
    }

    return {
      success: true,
      data: {
        labels: values.map((d) => d[labelInfoValue.data.labelIdx]).slice(1),
        colors: values.map((d) => d[labelInfoValue.data.colorIdx]).slice(1),
      },
    };
  } catch (e: unknown) {
    Logger.log(e);
    const err = e as Error;

    return {
      success: false,
      error: {
        code: 'Undefined',
        name: err.name,
        message: err.message,
      },
    };
  }
};

type SetLabelResponse = OperationResult<Labels>;
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
    // TODO: モードの判定と処理の振り分け
    const result = Utils.getAppState();
    if (!result.success) {
      return result;
    }
    const appState = result.data;
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

    // TODO: ここでモード判定？
    switch (appState) {
      case 'READY':
        // ラベルシートだけを更新
        break;
      case 'RUN':
        // ラベルシート、Seats, Viewを更新

        break;
    }
    // 新たに取得したものを返す
    const labelData = getLabelConfig();
    if (labelData.success) {
      return { success: true, data: labelData.data };
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
type ClassRoomResponse = OperationResult<ClassRoom>;
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

    if (
      width === null ||
      height === null ||
      name === null ||
      Number.isNaN(parseInt(width)) ||
      Number.isNaN(parseInt(height))
    ) {
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
      data: {
        column: parseInt(width),
        row: parseInt(height),
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
        name: err.name,
        message: err.message,
      },
    };
  }
};

type SeatSheetRespone = OperationResult<Seat[]>;

const getClassRoomSeatData = (): SeatSheetRespone => {
  try {
    const targetSheet = getTargetSheet(ENV_SEATS_SHEET.NAME);
    if (targetSheet === null) {
      return {
        success: false,
        error: {
          code: 'Config',
          message: `sheet ${ENV_SEATS_SHEET.NAME} is not found`,
        },
      };
    }
    const sheetValues = Utils.getSheetValues(ENV_SEATS_SHEET.NAME);
    if (!sheetValues.success) {
      return {
        success: false,
        error: sheetValues.error,
      };
    }
    // TODO: 使いまわしできそう？（ほかのところでは別のコードを書いてるかもしれない）
    // バリデーションチェック 規定ヘッダと設定されてるヘッダーの値の比較
    const values = sheetValues.data;
    if (
      values[0].length !== ENV_SEATS_SHEET.HEADER.size ||
      !values[0].every(
        (v, i) => v === Array.from(ENV_SEATS_SHEET.HEADER.values())[i]
      )
    ) {
      Logger.log(
        `expected ${ENV_SEATS_SHEET.NAME} header is [${Array.from(
          ENV_SEATS_SHEET.HEADER.values()
        ).join(',')}], but current value is [${values[0].join(',')}]`
      );

      return {
        success: false,
        error: {
          code: 'SheetHeader',
          message: `expected ${ENV_SEATS_SHEET.NAME} header is [${Array.from(
            ENV_SEATS_SHEET.HEADER.values()
          ).join(',')}], but current value is [${values[0].join(',')}]`,
        },
      };
    }
    let ret: Seat[] = [];

    for (const val of values.slice(1)) {
      if (val.length !== ENV_SEATS_SHEET.HEADER.size) {
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
            message: `first header value "Index" should be Interger`,
          },
        };
        // } else if (val[1] === '') {
        //   // バリデーションチェック 2つ目の要素`name`は NOT empty
        //   return {
        //     success: false,
        //     error: {
        //       code: 'InvalidValue',
        //       message: `second header value "name" should be NOT empty`,
        //     },
        //   };
      } else if (val[2] !== 'TRUE' && val[2] !== 'FALSE') {
        // バリデーションチェック 3つ目の要素はTRUE or FALSE(Sheet上では文字列)
        return {
          success: false,
          error: {
            code: 'InvalidValue',
            message: `third header value "visible" should be TRUE' or 'FALSE'`,
          },
        };
      }
      ret = [
        ...ret,
        {
          index: parseInt(val[0]),
          name: val[1],
          visible: val[2] === 'TRUE',
        },
      ];
    }

    return {
      success: true,
      data: ret,
    };
  } catch (e: unknown) {
    Logger.log(e);
    const err = e as UndefinedServerError;

    return {
      success: false,
      error: {
        code: 'Undefined',
        name: err.name,
        message: err.message,
      },
    };
  }
};

type ExistSheetResponse = OperationResult<{ isUnique: boolean }>;

/**
 * only check exist sheet
 * @param {string} sheetName
 * @returns {boolean}
 */
const isUniqueSheetNameOnSeets = (sheetName: string): ExistSheetResponse => {
  Logger.log(`sheet name: ${sheetName}`);
  try {
    return {
      success: true,
      data: { isUnique: Utils.getTargetSheet(sheetName) === null },
    };
  } catch (e: unknown) {
    Logger.log(e);
    const err = e as UndefinedServerError;

    return {
      success: false,
      error: {
        code: 'Undefined',
        name: err.name,
        message: err.message,
        options: {
          details: `during picking to ${sheetName} sheet`,
        },
      },
    };
  }
};

type GenSeatSheetReponse = OperationResult<void>;

// TODO: いったん結果を受け取れているかチェックするだけ
const newApp = async (data: string): Promise<GenSeatSheetReponse> => {
  const lock = LockService.getScriptLock();
  lock.waitLock(10 * 1000);

  try {
    const classLayoutData = JSON.parse(data) as ClassLayout;

    const appStateResult = Utils.getAppState();
    if (!appStateResult.success) {
      Logger.log(`get appstate error`);
      Utils.updateAppState('READY');

      return appStateResult;
    }
    const appState = appStateResult.data;
    Logger.log("let's go!");
    Utils.updateAppState('PREPARE');
    // delete named ranges
    Utils.deleteAllNamedRanges();
    // update ClassRooom Property
    const classRoomResult = Utils.updateClassRoomProperty({
      column: classLayoutData.column,
      row: classLayoutData.row,
      name: classLayoutData.name,
    });
    if (!classRoomResult.success) {
      Logger.log(`update classroom error`);
      Utils.updateAppState('READY');

      return classRoomResult;
    }
    // 座席設定シート更新

    const [seatConfigResult, updateLayoutResult, updateSeatsResult] =
      await Promise.all([
        updateSeatConfigSheet(classLayoutData),
        updateLayoutSheets(classLayoutData),
        updateSeats(classLayoutData),
      ]);
    if (!seatConfigResult.success) {
      Utils.updateAppState('READY');

      return seatConfigResult;
    }
    if (!updateLayoutResult.success) {
      Utils.updateAppState('READY');

      return updateLayoutResult;
    }
    if (!updateSeatsResult.success) {
      Utils.updateAppState('READY');

      return updateSeatsResult;
    }

    // TODO: bind???
    const labels = getLabelConfig();
    if (!labels.success) {
      Utils.updateAppState('READY');

      return labels;
    }

    // bind each seat Conditinal and Dropdown Validation Rules with Labels and Colors
    // chipにできないのとドロップダウンに色をつけられないので条件付き書式
    const tempRangeList = Utils.getSheetRangeListEveryCells(ENV_LABEL.NAME, 1);
    if (!tempRangeList.success) {
      Utils.updateAppState('READY');

      return tempRangeList;
    }
    const tempRange = tempRangeList.data.getRanges().slice(1); // ignore header
    const validationRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(labels.data.labels, true)
      .setAllowInvalid(false)
      .build();

    updateSeatsResult.data.forEach((createdSheetData) => {
      const pulldownCell = createdSheetData.cell
        .offset(1, 0, 1, 1)
        .setDataValidation(validationRule);
      const nameCell = createdSheetData.cell.offset(0, 0, 1, 1);
      const nowRules = labels.data.colors
        .map((color, idx) => {
          const pulldownRule = SpreadsheetApp.newConditionalFormatRule()
            .whenTextEqualTo(labels.data.labels[idx])
            .setBackground(color)
            .setRanges([pulldownCell])
            .build();

          const nameruletest = SpreadsheetApp.newConditionalFormatRule()
            .whenFormulaSatisfied(
              `=$${pulldownCell.getA1Notation()}=INDIRECT("'${
                ENV_LABEL.NAME
              }'!${tempRange[idx].getA1Notation()}")`
            )
            .setBackground(color)
            .setRanges([nameCell])
            .build();

          return [pulldownRule, nameruletest];
        })
        .flat();

      createdSheetData.sheet.setConditionalFormatRules(nowRules);
    });

    // TODO

    // complete
    Utils.updateAppState('RUN');

    // TODO: モード切替再考
    switch (appState) {
      case 'READY': {
        break;
      }
      case 'RUN':
        // TODO: update processing
        Logger.log('update!');
        break;
    }

    return { success: true, data: undefined };
  } catch (e: unknown) {
    const err = e as Error;

    return {
      success: false,
      error: {
        code: 'GenClass',
        message: `[${err.name}] - ${err.message}`,
        options: {
          details: `on generating seat`,
        },
      },
    };
  } finally {
    lock.releaseLock();
  }
};

// StateをRUNに
// Layout,Seatsを作成
// bind
// Configを非表示に

/*
const bindLabelAndSheets = () => {
  // ラベル情報を各シートに反映・更新
};
*/

type UpdateSeatListResult = OperationResult<boolean>;
const updateSeatConfigSheet = (data: ClassLayout): UpdateSeatListResult => {
  // 座席設定シートの存在確認・生成
  // 座席設定シートの構造（ヘッダーとか）確認
  // 座席設定シートへデータ反映
  const lock = LockService.getScriptLock();
  lock.waitLock(10 * 1000);
  try {
    if (data.column * data.row !== data.seats.length) {
      return {
        success: false,
        error: {
          code: 'InvalidValue',
          message: `seat data invalid. seat length: ${data.seats.length} should be the product of column:${data.column} and row:${data.row}.`,
        },
      };
    }
    const targetSheet = getTargetSheet(ENV_SEATS_SHEET.NAME);

    if (targetSheet === null) {
      return {
        success: false,
        error: {
          code: 'SheetNotFound',
          message: `${ENV_SEATS_SHEET.NAME} not found`,
        },
      };
    }
    targetSheet.clear().clearNotes();
    targetSheet.setFrozenRows(1);
    // 素直に設定
    const range = targetSheet.getRange(
      ENV_SEATS_SHEET.OFFSET_ROW,
      ENV_SEATS_SHEET.OFFSET_COL,
      data.row * data.column + 1, // body + header(1 row)
      ENV_SEATS_SHEET.HEADER.size
    );
    range.setValues([
      Array.from(ENV_SEATS_SHEET.HEADER.values()),
      ...data.seats.map((v) => [v.index, v.name, v.visible]),
    ]);

    return { success: true, data: true };
  } catch (e: unknown) {
    Logger.log(e);
    const err = e as Error;

    return {
      success: false,
      error: {
        code: 'Undefined',
        name: err.name,
        message: err.message,
      },
    };
  } finally {
    lock.releaseLock();
  }
};

type CreateSeasResult = OperationResult<CreatedSheet[]>;

const updateSeats = async (data: ClassLayout): Promise<CreateSeasResult> => {
  const lock = LockService.getScriptLock();
  lock.waitLock(10 * 1000);
  try {
    // TODO: やる
    // 既存の同名のシートは無視
    //

    const result = await Promise.all(
      data.seats.map((seat) => {
        return setupSeatSheet({ ...seat, name: seat.name ?? '' });
      })
    );

    return {
      success: true,
      data: result,
    };
  } catch (e: unknown) {
    Logger.log(e);
    const err = e as Error;

    return {
      success: false,
      error: {
        code: 'Undefined',
        name: err.name,
        message: err.message,
      },
    };
  } finally {
    lock.releaseLock();
  }
};

// TODO: やりながらきめる
type CreatedSheet = {
  index: number;
  sheet: GoogleAppsScript.Spreadsheet.Sheet;
  cell: GoogleAppsScript.Spreadsheet.Range;
};
// TODO: とりあえず動かす
// それぞれシート挿入
// TODO: 名前重複どうしよう(どこでやるべき？)
const setupSeatSheet = (seat: Seat): CreatedSheet => {
  try {
    const createdSheet = ss
      .insertSheet(
        seat.name !== '' ? `${seat.index}_${seat.name}` : `${seat.index}`
      )
      .setRowHeight(ENV_SEAT.OFFSET_ROW, ENV_SEAT.SEAT_H)
      .setColumnWidth(ENV_SEAT.OFFSET_COL, ENV_SEAT.SEAT_W);
    if (!seat.visible) createdSheet.hideSheet();
    const cell = createdSheet
      .getRange(ENV_SEAT.OFFSET_ROW, ENV_SEAT.OFFSET_COL, 2)
      .setBorder(
        true,
        true,
        true,
        true,
        null,
        null,
        '#3d3d3d',
        SpreadsheetApp.BorderStyle.SOLID_MEDIUM
      );

    return {
      index: seat.index,
      sheet: createdSheet,
      cell,
    };
  } catch (e: unknown) {
    const err = e as Error;
    Logger.log(e);
    throw err;
  }
};

type UpdateLayoutResult = OperationResult<{
  ranges: GoogleAppsScript.Spreadsheet.RangeList;
  sheet: GoogleAppsScript.Spreadsheet.Sheet;
}>;

const updateLayoutSheets = (data: ClassLayout): UpdateLayoutResult => {
  const lock = LockService.getScriptLock();
  lock.waitLock(10 * 1000);
  try {
    const existSheet = getTargetSheet(data.name);
    if (existSheet !== null) {
      existSheet.setName(`${Utils.MMddHHmmss()}_${data.name}_old`);
      existSheet.clearConditionalFormatRules();
      existSheet.protect();
      existSheet.setTabColor('#666666');
    }
    // TODO: 挿入する場所 確認 とりあえず2番目にしているだけ
    const viewSheet = ss.insertSheet(data.name, 2);

    const ranges = Array.from({ length: data.row }, (_, n) => {
      const row = ENV_VIEW.OFFSET_COL + n * 2;

      return Array.from({ length: data.column }, (_, m) => {
        const col = `${Utils.colNumtoA1(ENV_VIEW.OFFSET_COL + m)}`;

        return `${col}${row}:${col}${row + 1}`;
      });
    }).flat();
    const rangeList = viewSheet.getRangeList(ranges);
    rangeList.setBorder(
      true,
      true,
      true,
      true,
      null,
      null,
      '#000000',
      SpreadsheetApp.BorderStyle.SOLID_MEDIUM
    );
    rangeList.setWrap(true);

    // 高さを確定
    for (let r = ENV_VIEW.OFFSET_ROW; r <= data.row * 2; r += 2) {
      viewSheet.setRowHeight(r, ENV_VIEW.CELL_H);
    }
    // 幅を確定
    for (
      let c = ENV_VIEW.OFFSET_COL;
      c <= ENV_VIEW.OFFSET_COL + data.column;
      c++
    ) {
      viewSheet.setColumnWidth(c, ENV_VIEW.CELL_W);
    }

    return {
      success: true,
      data: {
        ranges: rangeList,
        sheet: viewSheet,
      },
    };
  } catch (e: unknown) {
    const err = e as Error;
    Logger.log(err);

    return {
      success: false,
      error: {
        code: 'Undefined',
        name: err.name,
        message: err.message,
      },
    };
  } finally {
    lock.releaseLock();
  }
};

export {
  _isAllowedConfigSheet, // TODO: 未使用
  getClassRoomConfig,
  getClassRoomSeatData,
  getConfigProtectData,
  getId,
  getLabelConfig,
  newApp,
  getSpreadSheetName,
  getUserInfo,
  initConfig,
  isUniqueSheetNameOnSeets,
  setAllConfigProtections,
  setLabelConfig,
};

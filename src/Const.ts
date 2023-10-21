import { type TupleOf } from './Menu/types';

const ss = SpreadsheetApp.getActive();

/**
 * 設定シート
 * デフォルト値など
 * ラベル
 * 座席表リスト
 */

type LabelsSet = TupleOf<string, 2>;
type LabelHexColor = [
  string,
  `#${string}${string}${string}${string}${string}${string}` // さすがに1~Fに限るのはダルい
];
const LABEL_SHEET_NAME = 'ラベル設定';
const LABEL_HEADER = ['Labels', 'colors'] as const;
const LABEL_DEFAULT_VALUES = [
  ['All Right!', '#61a7e9'] as LabelHexColor,
  ['Hmm...', '#ee786e'] as LabelHexColor,
] as const satisfies readonly LabelsSet[];

// 設定シート全部(予定)
const CONFIG_SHEET = [LABEL_SHEET_NAME];

/**
 * ラベル設定シートデータ
 */
const ENV_LABEL = {
  SHEET_NAME: LABEL_SHEET_NAME,
  HEADER: new Map(LABEL_HEADER.map((v, i) => [i, v])),
  DEFAULT_VALUES: LABEL_DEFAULT_VALUES,
  OFFSET_COL: 1, // A
  OFFSET_ROW: 1, // 1
} as const satisfies Record<
  string,
  string | readonly LabelsSet[] | LabelsSet | Map<number, string> | number
>;

const _ENV_LABELS_OFFSET_COL = 1; // A
const _ENV_LABELS_OFFSET_ROW = 1; // 1

// const _ENV_LABELS_DEFAULT = [_ENV_LABELS_HEADER, ..._ENV_LABELS_DEFAULT_VALUES];

/**
 * DEFAULT PROPERTIES
 * PropertyServceのプロパティ名とか値
 */
const PROPERTY_DEFAULT: Record<string, string> = {
  PROPERTY_HEIGHT: '5',
  PROPERTY_WIDTH: '5',
};

/**
 * 座席シート設定
 */
const SEAT_SHEET = '座席';
// 座席（グリッドにしたときの高さ・幅） Property Store
const PROPERTY_WIDTH = 'classroom_width';
const PROPERTY_HEIGHT = 'classroom_height';

export {
  ss,
  ENV_LABEL,
  // ENV_SHEET,
  // CONFIG_LABEL,
  // CONFIG_COLOR,
  // CONFIG_LABELS_HEADER,
  // CONFIG_LABELS_DEFAULT,
  // CONFIG_DEFAULT_COLUMN_OFFSET,
  // CONFIG_DEFAULT_ROW_OFFSET,
  CONFIG_SHEET,
  PROPERTY_DEFAULT,
  // type ConfigElements,
  SEAT_SHEET,
  PROPERTY_HEIGHT,
  PROPERTY_WIDTH,
};

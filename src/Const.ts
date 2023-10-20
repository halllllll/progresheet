import { type TupleOf } from './Menu/types';

const ss = SpreadsheetApp.getActive();

/**
 * 設定シート
 * デフォルト値など
 * ラベル
 * 座席表リスト
 */
const CONFIG_SHEET = '設定';
const CONFIG_LABEL = 'Labels';
const CONFIG_COLOR = 'colors';
const CONFIG_HEADER = [CONFIG_LABEL, CONFIG_COLOR];
const CONFIG_DEFAULT_VALUES = [
  ['All Right!', '#61a7e9'],
  ['Hmm...', '#ee786e'],
];
const CONFIG_DEFAULT_COLUMN_OFFSET = 1; // A
const CONFIG_DEFAULT_ROW_OFFSET = 1; // 1

type ConfigElements = TupleOf<string, 2>;
type Property = Record<string, string>;

const CONFIG_DEFAULT = [CONFIG_HEADER, ...CONFIG_DEFAULT_VALUES];

/**
 * DEFAULT PROPERTIES
 * PropertyServceのプロパティ名とか値
 */
const PROPERTY_DEFAULT: Property = {
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
  CONFIG_SHEET,
  CONFIG_LABEL,
  CONFIG_COLOR,
  CONFIG_HEADER,
  CONFIG_DEFAULT,
  CONFIG_DEFAULT_COLUMN_OFFSET,
  CONFIG_DEFAULT_ROW_OFFSET,
  PROPERTY_DEFAULT,
  type ConfigElements,
  SEAT_SHEET,
  PROPERTY_HEIGHT,
  PROPERTY_WIDTH,
};

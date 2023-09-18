import { type TupleOf } from './Menu/types';

const ss = SpreadsheetApp.getActive();

// 設定用シート名
const CONFIG_SHEET = '設定';

// 設定シート デフォルト値
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

const CONFIG_DEFAULT = [CONFIG_HEADER, ...CONFIG_DEFAULT_VALUES];

export {
  ss,
  CONFIG_SHEET,
  CONFIG_LABEL,
  CONFIG_COLOR,
  CONFIG_HEADER,
  CONFIG_DEFAULT,
  CONFIG_DEFAULT_COLUMN_OFFSET,
  CONFIG_DEFAULT_ROW_OFFSET,
  type ConfigElements,
};

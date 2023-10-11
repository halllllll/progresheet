import { type TupleOf } from './Menu/types';

const ss = SpreadsheetApp.getActive();

// 設定用シート名
const CONFIG_SHEET = '設定';

// 設定シート デフォルト値
const CONFIG_LABEL = 'Labels';
const CONFIG_COLOR = 'colors';
const PROPERTY_WIDTH = 'classroom_width';
const PROPERTY_HEIGHT = 'classroom_height';
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

// default properties
const PROPERTY_DEFAULT: Property = {
  PROPERTY_HEIGHT: '1',
  PROPERTY_WIDTH: '1',
};

export {
  ss,
  CONFIG_SHEET,
  CONFIG_LABEL,
  CONFIG_COLOR,
  PROPERTY_HEIGHT,
  PROPERTY_WIDTH,
  CONFIG_HEADER,
  CONFIG_DEFAULT,
  CONFIG_DEFAULT_COLUMN_OFFSET,
  CONFIG_DEFAULT_ROW_OFFSET,
  PROPERTY_DEFAULT,
  type ConfigElements,
};

import { type CONFIG_SHEET } from './SheetEnv';
import { type Seat } from '@/Menu/types';

/** -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 *
 * 座席設定シートのデータ
 * 基本的にここしかいじらないようにしたい
 *
 * *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 */
const SEAT_SHEET_NAME: CONFIG_SHEET = '座席設定';
const SEAT_HEADER = ['Index', 'LabelName', 'visible'] as const;

const SEAT_DEFAULT_VALUES = [
  {
    index: 1,
    name: 'pseudo1',
    visible: true,
  } satisfies Seat,
  {
    index: 2,
    name: 'pseudo2',
    visible: true,
  } satisfies Seat,
  {
    index: 3,
    name: 'pseudo3',
    visible: true,
  } satisfies Seat,
  {
    index: 4,
    name: 'pseudo4',
    visible: true,
  } satisfies Seat,
  {
    index: 5,
    name: 'pseudo5',
    visible: true,
  } satisfies Seat,
  {
    index: 6,
    name: 'pseudo6',
    visible: true,
  } satisfies Seat,
  {
    index: 7,
    name: 'pseudo7',
    visible: true,
  } satisfies Seat,
  {
    index: 8,
    name: 'pseudo8',
    visible: true,
  } satisfies Seat,
  {
    index: 9,
    name: 'pseudo9',
    visible: true,
  } satisfies Seat,
  {
    index: 10,
    name: 'pseudo10',
    visible: true,
  } satisfies Seat,
  {
    index: 11,
    name: 'pseudo11',
    visible: true,
  } satisfies Seat,
  {
    index: 12,
    name: 'pseudo12',
    visible: true,
  } satisfies Seat,
  {
    index: 13,
    name: 'pseudo13',
    visible: true,
  } satisfies Seat,
  {
    index: 14,
    name: 'pseudo14',
    visible: true,
  } satisfies Seat,
  {
    index: 15,
    name: 'pseudo15',
    visible: true,
  } satisfies Seat,
  {
    index: 16,
    name: 'pseudo16',
    visible: true,
  } satisfies Seat,
  {
    index: 17,
    name: 'pseudo17',
    visible: true,
  } satisfies Seat,
  {
    index: 18,
    name: 'pseudo18',
    visible: true,
  } satisfies Seat,
  {
    index: 19,
    name: 'pseudo19',
    visible: true,
  } satisfies Seat,
  {
    index: 20,
    name: 'pseudo20',
    visible: true,
  } satisfies Seat,
  {
    index: 21,
    name: 'pseudo21',
    visible: true,
  } satisfies Seat,
  {
    index: 22,
    name: 'pseudo22',
    visible: true,
  } satisfies Seat,
  {
    index: 23,
    name: 'pseudo23',
    visible: true,
  } satisfies Seat,
  {
    index: 24,
    name: 'pseudo24',
    visible: true,
  } satisfies Seat,
  {
    index: 25,
    name: 'pseudo25',
    visible: true,
  } satisfies Seat,
] as const satisfies readonly Seat[];

const ENV_SEAT = {
  NAME: SEAT_SHEET_NAME,
  HEADER: new Map(SEAT_HEADER.map((v, i) => [i, v])),
  DEFAULT_VALUES: SEAT_DEFAULT_VALUES,
  OFFSET_COL: 1, // A
  OFFSET_ROW: 1, // 1
} as const satisfies Record<
  string,
  CONFIG_SHEET | Map<number, string> | readonly Seat[] | number
>;

export { ENV_SEAT };

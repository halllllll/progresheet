import { type CONFIG_SHEET } from './SheetEnv';

/** -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 * 座席設定シートのデータ
 * 基本的にここしかいじらないようにしたい
 * *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 */
const SEAT_SHEET_NAME: CONFIG_SHEET = '座席設定';
const SEAT_HEADER = ['Index', 'LabelName', 'visible'] as const;

const ENV_SEAT = {
  SHEET_NAME: SEAT_SHEET_NAME,
  HEADER: new Map(SEAT_HEADER.map((v, i) => [i, v])),
} as const satisfies Record<string, CONFIG_SHEET | Map<number, string>>;

export { ENV_SEAT };

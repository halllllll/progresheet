import { type CONFIG_SHEET } from './SheetEnv';
import { type TupleOf } from '@/Menu/types';

type LabelsSet = TupleOf<string, 2>;
type LabelHexColor = [
  string,
  `#${string}${string}${string}${string}${string}${string}` // さすがに1~Fに限るのはダルい
];

/** -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 *
 * ラベル設定シートのデータ
 * 基本的にここしかいじらないようにしたい
 *
 * *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 */
const LABEL_SHEET_NAME: CONFIG_SHEET = 'ラベル設定';
const LABEL_HEADER = ['Labels', 'colors'] as const;
const LABEL_DEFAULT_VALUES = [
  ['All Right!', '#61a7e9'] as LabelHexColor,
  ['Hmm...', '#ee786e'] as LabelHexColor,
] as const satisfies readonly LabelsSet[];

/** -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 *
 * ラベル設定シート用オブジェクト
 *
 * *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 */
const ENV_LABEL = {
  SHEET_NAME: LABEL_SHEET_NAME,
  HEADER: new Map(LABEL_HEADER.map((v, i) => [i, v])),
  DEFAULT_VALUES: LABEL_DEFAULT_VALUES,
  OFFSET_COL: 1, // A
  OFFSET_ROW: 1, // 1
} as const satisfies Record<
  string,
  CONFIG_SHEET | readonly LabelsSet[] | LabelsSet | Map<number, string> | number
>;

export { ENV_LABEL };

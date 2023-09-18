// 固定長タプル
export type TupleOf<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>;

// 設定のやつ
export type Labels = {
  labels: string[];
  colors: string[];
};

// エラーつきレスポンス
export type Resp = { success: boolean };

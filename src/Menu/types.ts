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

// 編集者設定用
export type Editor = {
  useId: string;
  name?: string; // TODO: どうせ名前は取得できないが、かわりのものがあれば
  editable: boolean;
};

export type EditorRequest = {
  editors: Editor[];
};

// 教室
export type HeightValue = string | number;
export type WidthValue = string | number;
export type ClassRoom = {
  column: HeightValue;
  row: WidthValue;
};

// エラーつきレスポンス
export type Resp = { success: boolean };

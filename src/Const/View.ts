const ENV_VIEW = {
  OFFSET_COL: 2, // B
  OFFSET_ROW: 2, // 2
  CELL_H: 50,
  CELL_W: 140,
} as const satisfies Record<string, number>;

export { ENV_VIEW };

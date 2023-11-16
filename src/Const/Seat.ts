const ENV_SEAT = {
  OFFSET_COL: 2, // B
  OFFSET_ROW: 2, // 2
  SEAT_H: 100,
  SEAT_W: 300,
} as const satisfies Record<string, number>;

export { ENV_SEAT };

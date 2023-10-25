const CONFIG_SHEET_NAMES = ['ラベル設定', '座席設定'] as const;
type CONFIG_SHEET = (typeof CONFIG_SHEET_NAMES)[number];

export { CONFIG_SHEET_NAMES, type CONFIG_SHEET };

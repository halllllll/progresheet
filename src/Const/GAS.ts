/**
 * Root Object of This App SpreadSheet.
 */
const ss = SpreadsheetApp.getActive();

/** -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 *
 * DEFAULT Properties Stored Key-Value
 *
 * *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 */
const PROPERTY_DEFAULT: Record<string, string> = {
  CLASSROOM_HEIGHT: '5',
  CLASSROOM_WIDTH: '5',
  // 座席（グリッドにしたときの高さ・幅） Property Store
  // PROPERTY_WIDTH: 'classroom_width',
  // PROPERTY_HEIGHT: 'classroom_height',

  CLASSROOM_CLASSNAME: '元気いっぱい',
};

export { ss, PROPERTY_DEFAULT };

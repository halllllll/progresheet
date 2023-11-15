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
// TODO: いい名前
type APP_STATES = 'READY' | 'RUN' | 'PREPARE';
const APP_STATE_PROPERTY_NAME = 'APP_STATE';
const PROPERTY_DEFAULT = {
  CLASSROOM_HEIGHT: '5',
  CLASSROOM_WIDTH: '5',
  CLASSROOM_CLASSNAME: '元気いっぱい',
  APP_STATE: 'READY' as APP_STATES,
};

type PROPERTY_NAMES = keyof typeof PROPERTY_DEFAULT;

export {
  ss,
  PROPERTY_DEFAULT,
  type APP_STATES,
  type PROPERTY_NAMES,
  APP_STATE_PROPERTY_NAME,
};

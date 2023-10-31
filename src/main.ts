import * as Service from './Menu/AppsScript/service';
import { customMenu, initMenu } from './Menu/AppsScript/utils';

const onOpen = (): void => {
  const menu = SpreadsheetApp.getUi().createMenu('Custom menu');
  menu.addItem('Progresheet管理', 'customMenu_');
  menu.addItem('初期化', 'initMenu_');
  menu.addToUi();
};
const getUserInfo = Service.getUserInfo;
const getSpreadSheetName = Service.getSpreadSheetName;
const initConfig = Service.initConfig;
const getLabelConfig = Service.getLabelConfig;
const setLabelConfig = Service.setLabelConfig;
const getClassRoomConfig = Service.getClassRoomConfig;
const getClassRoomSeat = Service.getClassRoomSeatData;
const getConfigProtection = Service.getConfigProtectData;
const setAllConfigProtections = Service.setAllConfigProtections;

// Exposed to GAS global function
global.onOpen = onOpen;
global.customMenu_ = customMenu;
global.initMenu_ = initMenu;
global.getUserInfo = getUserInfo;
global.getSpreadSheetName = getSpreadSheetName;
global.initConfig = initConfig;
global.getLabelConfig = getLabelConfig;
global.setLabelConfig = setLabelConfig;
global.getClassRoomConfig = getClassRoomConfig;
global.getClassRoomSeat = getClassRoomSeat;
global.getConfigProtection = getConfigProtection;
global.setAllConfigProtections = setAllConfigProtections;

// Exposed to Frontend API
export {
  getUserInfo,
  getSpreadSheetName,
  initConfig,
  getLabelConfig,
  setLabelConfig,
  getClassRoomConfig,
  getClassRoomSeat,
  getConfigProtection,
  setAllConfigProtections,
};

import * as Service from './Menu/AppsScript/service';
import { customMenu, initMenu } from './Menu/AppsScript/utils';

const onOpen = (): void => {
  const menu = SpreadsheetApp.getUi().createMenu('Custom menu');
  menu.addItem('Progresheet管理', 'customMenu_');
  menu.addItem('初期化', 'initMenu_');
  menu.addToUi();
};

const getId = Service.getId;
const getSpreadSheetName = Service.getSpreadSheetName;
const initConfig = Service.initConfig;
const getLabelConfig = Service.getLabelConfig;
const setLabelConfig = Service.setLabelConfig;

// Exposed to GAS global function
global.onOpen = onOpen;
global.customMenu_ = customMenu;
global.initMenu_ = initMenu;
global.getId = getId;
global.getSpreadSheetName = getSpreadSheetName;
global.initConfig = initConfig;
global.getLabelConfig = getLabelConfig;
global.setLabelConfig = setLabelConfig;

// Exposed to Frontend API
export {
  getId,
  getSpreadSheetName,
  initConfig,
  getLabelConfig,
  setLabelConfig,
};

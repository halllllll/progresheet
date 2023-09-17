import * as Service from './Menu/AppsScript/service';
import { customMenu } from './Menu/AppsScript/utils';

const onOpen = (): void => {
  const menu = SpreadsheetApp.getUi().createMenu('Custom menu');
  menu.addItem('Progresheet管理', 'customMenu_');
  menu.addToUi();
};

const getId = Service.getId;
const getSpreadSheetName = Service.getSpreadSheetName;
const initConfig = Service.initConfig;

// Exposed to GAS global function
global.onOpen = onOpen;
global.customMenu_ = customMenu;
global.getId = getId;
global.getSpreadSheetName = getSpreadSheetName;
global.initConfig = initConfig;

// Exposed to Frontend API
export { getId, getSpreadSheetName, initConfig };

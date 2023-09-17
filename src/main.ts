import { ss, INIT_CONFIG_DEFAULT } from './Const';
import { customMenu } from './Menu/Menu';

const onOpen = (): void => {
  const menu = SpreadsheetApp.getUi().createMenu('Custom menu');
  menu.addItem('custom menu', 'customMenu_');
  menu.addToUi();
};

const getId = (): string => {
  const userid = Session.getActiveUser().getEmail();
  console.log(`get id: ${userid}`);

  return userid;
};

const getSpreadSheetName = (): string => {
  const sheetname = ss.getName();

  return sheetname;
};

// Exposed to GAS global function
global.onOpen = onOpen;
global.customMenu_ = customMenu;
global.getId = getId;
global.getSpreadSheetName = getSpreadSheetName;
global.initConfigSheet_ = INIT_CONFIG_DEFAULT;

// Exposed to Frontend API
export { getId, getSpreadSheetName, INIT_CONFIG_DEFAULT };

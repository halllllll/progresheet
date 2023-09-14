// import { ss } from './Const';
import { customMenu1 } from './Menu/Menu';

const onOpen = (): void => {
  const menu = SpreadsheetApp.getUi().createMenu('Custom menu');
  menu.addItem('custom menu from html', 'customMenu1_');
  menu.addToUi();
};

const getId = (): string => {
  const userid = Session.getActiveUser().getEmail();
  console.log(`get id: ${userid}`);

  return userid;
};

// Exposed to GAS global function
global.onOpen = onOpen;
global.customMenu1_ = customMenu1;
global.getId = getId;

// Exposed to Frontend API
// export { affectCountToA1, getSpreadSheetName, getSpreadSheetUrl };
export { getId };

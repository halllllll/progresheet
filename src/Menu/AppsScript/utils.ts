import { PROPERTY_DEFAULT } from '@/Const';
import { initConfig } from './service';

const customMenu = (): void => {
  const html = HtmlService.createHtmlOutputFromFile('menu.html')
    .setWidth(800)
    .setHeight(800);
  SpreadsheetApp.getUi().showModalDialog(html, 'menu');
};

const getPropertyByName = (propertyName: string): string | null => {
  const properties = PropertiesService.getScriptProperties();

  return properties.getProperty(propertyName);
};

const setDefaultProperty = (): void => {
  const properties = PropertiesService.getScriptProperties();
  properties.deleteAllProperties();
  properties.setProperties(PROPERTY_DEFAULT);
};

const initMenu = (): void => {
  const ui = SpreadsheetApp.getUi();
  let btn = ui.alert('初期化します', ui.ButtonSet.OK_CANCEL);
  if (btn === ui.Button.CANCEL) return;
  btn = ui.alert(
    '本当に初期化します。よろしいですか？',
    ui.ButtonSet.OK_CANCEL
  );
  if (btn === ui.Button.CANCEL) return;

  if (initConfig().success) {
    ui.alert('初期化しました');
  } else {
    ui.alert('初期化に失敗しました。。。');
  }
};

export { customMenu, initMenu, getPropertyByName, setDefaultProperty };

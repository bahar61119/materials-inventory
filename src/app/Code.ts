import { ViewFileNames } from "./enums/fileNamesEnum";

function doGet() {
  return HtmlService.createTemplateFromFile(ViewFileNames.INDEX)
    .evaluate()
    .setTitle("Material Inventory");
} 

function onOpen() {
  createMenu_();
}

function createMenu_() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu("Inventory Application");
  menu.addItem("Open Application", "loadApplication");
  menu.addToUi();
}

export {
  doGet,
  onOpen
};

import { ViewFileNames } from "./constants/fileNames";

function doGet(event: GoogleAppsScript.Events.DoGet) {
  console.log("Opening from doGet ...");
  console.log(event);
  return HtmlService.createTemplateFromFile(ViewFileNames.INDEX)
    .evaluate()
    .setTitle("Material Inventory");
} 

function onOpen(event: GoogleAppsScript.Events.DocsOnOpen) {
  console.log("Opening from doOpen ...");
  console.log(event);
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

import { ViewFileNames } from "../enums/fileNamesEnum";

function loadApplication() {
  const htmlService = HtmlService.createTemplateFromFile(ViewFileNames.INDEX);
  const html = htmlService.evaluate();
  html.setWidth(2048).setHeight(1024)
  const ui = SpreadsheetApp.getUi();
  ui.showModalDialog(html, "Application");
}

export {
  loadApplication
}
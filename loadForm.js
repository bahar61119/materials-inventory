function loadApplication() {
  const htmlService = HtmlService.createTemplateFromFile("main");
  const html = htmlService.evaluate();
  html.setWidth(2048).setHeight(1024)
  const ui = SpreadsheetApp.getUi();
  ui.showModalDialog(html, "Application");
}


function createMenu_() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu("Inventory Application");
  menu.addItem("Open Application", "loadApplication");
  menu.addToUi();
}

function onOpen() {
  createMenu_();
}
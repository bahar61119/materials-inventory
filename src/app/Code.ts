import { loadIndexView } from './controllers/views/loadIndexViews';

export function doGet(event: GoogleAppsScript.Events.DoGet) {
  console.log("Opening from doGet ...");
  console.log(event);
  
  // check if the user is registered or not.
  return loadIndexView(true);
} 

export function doPost(event: GoogleAppsScript.Events.DoPost) {
  console.log("Opening from doPost ...");
  console.log(event);
} 

// function onOpen(event: GoogleAppsScript.Events.DocsOnOpen) {
//   console.log("Opening from doOpen ...");
//   console.log(event);
//   createMenu_();
// }

// function createMenu_() {
//   const ui = SpreadsheetApp.getUi();
//   const menu = ui.createMenu("Inventory Application");
//   menu.addItem("Open Application", "loadApplication");
//   menu.addToUi();
// }

// export {
//   onOpen
// };

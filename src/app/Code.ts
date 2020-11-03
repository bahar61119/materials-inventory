import { loadIndexView } from './controllers/views/loadIndexViews';
import { ApplicationDBService } from './services/applicationDBService';

export function doGet(event: GoogleAppsScript.Events.DoGet) {
  console.log("Opening from doGet ...");
  console.log(event);
  ApplicationDBService.prepareDatabase();
  return loadIndexView();
} 

export function doPost(event: GoogleAppsScript.Events.DoPost) {
  console.log("Opening from doPost ...");
  console.log(event);
}

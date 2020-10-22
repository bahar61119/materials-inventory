export function loadView(contentHtmlFile: string, data: any = "") {
  const htmlService = HtmlService.createTemplateFromFile(contentHtmlFile);
  htmlService.data = data;
  return htmlService.evaluate().getContent();
}

function doGet() {
  return HtmlService.createTemplateFromFile("main")
    .evaluate()
    .setTitle("Material Inventory");
} 

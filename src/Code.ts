function doGet() {
  return HtmlService.createTemplateFromFile("src/main")
    .evaluate()
    .setTitle("Material Inventory");
} 

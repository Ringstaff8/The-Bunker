function showInventoryAdjustment() {

  const html = HtmlService
    .createTemplateFromFile("inventoryAdjustment")
    .evaluate()
    .setWidth(900)
    .setHeight(700);

  SpreadsheetApp.getUi().showModalDialog(
    html,
    "🔄 Inventory Adjustment"
  );

}
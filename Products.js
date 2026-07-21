/**
 * =====================================================
 * PRODUCT MAINTENANCE
 * Beta 1.1
 * =====================================================
 */

function showProductsMaintenance() {

  const html = HtmlService
    .createTemplateFromFile("products")
    .evaluate()
    .setWidth(1100)
    .setHeight(700);

  SpreadsheetApp.getUi().showModalDialog(
    html,
    "Product Maintenance"
  );

}

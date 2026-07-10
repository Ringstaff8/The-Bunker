/**
 * ==========================================================
 * THE BUNKER
 * Inventory.gs
 * Beta 1.0
 * ==========================================================
 */

/**
 * Opens the Receive Inventory screen.
 */
function showReceiving() {

  const html = HtmlService
    .createTemplateFromFile("inventory")
    .evaluate()
    .setWidth(1100)
    .setHeight(750);

  SpreadsheetApp.getUi().showModalDialog(
    html,
    "📦 Receive Inventory"
  );

}


/**
 * Adds inventory to a product.
 *
 * productId = Product ID from Products sheet
 * quantity = Number to add
 */
function receiveInventory(productId, quantity) {

  const sheet = getProductsSheet();

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {

    if (data[i][0] == productId) {

      const current = Number(data[i][9]);

      sheet
        .getRange(i + 1, 10)
        .setValue(current + Number(quantity));

      return true;

    }

  }

  throw new Error("Product not found.");

}


/**
 * Returns products for the inventory screen.
 */
function loadInventoryProducts() {

  return getActiveProducts();

}

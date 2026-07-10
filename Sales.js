/**
 * ==========================================================
 * THE BUNKER
 * Sales.gs
 * Beta 1.0
 * ==========================================================
 */

/**
 * Opens the Ring Up Sale window.
 */
function showSales() {

  const html = HtmlService
    .createTemplateFromFile("sales")
    .evaluate()
    .setWidth(1400)
    .setHeight(900);

  SpreadsheetApp
    .getUi()
    .showModalDialog(html, "🛒 Ring Up Sale");

}


/**
 * Returns matching products.
 */
function getSearchResults(searchText){

  return searchProducts(searchText);

}


/**
 * Completes a sale.
 * Transactions.gs will perform all processing.
 */
function saveSale(cart,paymentType){

  return completeSale(cart,paymentType);

}


function loadProducts() {
  return getActiveProducts();
}
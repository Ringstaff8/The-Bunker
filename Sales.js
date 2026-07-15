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

  showDialog(
    "sales",
    "🛒 Ring Up Sale",
    1400,
    900
  );

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
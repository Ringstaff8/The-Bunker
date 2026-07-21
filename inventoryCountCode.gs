/**
 * Opens the Inventory Count window.
 */
function showInventoryCount() {

  showDialog(
    "inventoryCount",
    "📋 Inventory Count",
    1200,
    700
  );

}


function loadCategories() {

  const products = getActiveProducts();

  const categories = [...new Set(
    products.map(product => String(product[PRODUCT_COLUMNS.CATEGORY]).trim())
  )];

  categories.sort();

  return categories;

}


function loadProductsByCategory(category) {

  const session = getOrCreateInventorySession();

  const products = getActiveProducts();

  const filteredProducts = products.filter(function(product) {

    return String(product[PRODUCT_COLUMNS.CATEGORY]).trim() ===
           String(category).trim();

  });

  const detailSheet = getInventoryCountDetailsSheet();
  const detailData = detailSheet.getDataRange().getValues();

  return filteredProducts.map(function(product) {

    let countedQty = Number(product[PRODUCT_COLUMNS.ONHAND]) || 0;

    for (let i = 1; i < detailData.length; i++) {

      if (
        String(detailData[i][INVENTORY_DETAIL_COLUMNS.SESSION_ID]) === String(session.sessionId) &&
        String(detailData[i][INVENTORY_DETAIL_COLUMNS.CATEGORY]).trim() === String(category).trim() &&
        String(detailData[i][INVENTORY_DETAIL_COLUMNS.PRODUCT_ID]) === String(product[PRODUCT_COLUMNS.ID])
      ) {

        countedQty =
          Number(detailData[i][INVENTORY_DETAIL_COLUMNS.COUNTED_QTY]) || 0;

        break;

      }

    }

    return {
      productId: product[PRODUCT_COLUMNS.ID],
      sku: product[PRODUCT_COLUMNS.SKU],
      category: product[PRODUCT_COLUMNS.CATEGORY],
      design: product[PRODUCT_COLUMNS.DESIGN],
      collection: product[PRODUCT_COLUMNS.COLLECTION],
      name: product[PRODUCT_COLUMNS.NAME],
      size: product[PRODUCT_COLUMNS.SIZE],
      onHand: Number(product[PRODUCT_COLUMNS.ONHAND]) || 0,
      countedQty: countedQty
    };

  });

}
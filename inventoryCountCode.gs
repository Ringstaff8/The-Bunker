function showInventoryCount() {

  const html = HtmlService
    .createTemplateFromFile("inventoryCount")
    .evaluate()
    .setWidth(1200)
    .setHeight(700);

  SpreadsheetApp.getUi().showModalDialog(
    html,
    "📋 Inventory Count"
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

  const filtered = products.filter(function(product) {
    return String(product[PRODUCT_COLUMNS.CATEGORY]).trim() ===
           String(category).trim();
  });

  const detailSheet = getInventoryCountDetailsSheet();
  const detailData = detailSheet.getDataRange().getValues();

  return filtered.map(function(product) {

    let countedQty = Number(product[PRODUCT_COLUMNS.ONHAND]);

    for (let i = 1; i < detailData.length; i++) {

      if (
        detailData[i][INVENTORY_DETAIL_COLUMNS.SESSION_ID] === session.sessionId &&
        detailData[i][INVENTORY_DETAIL_COLUMNS.CATEGORY] === category &&
        detailData[i][INVENTORY_DETAIL_COLUMNS.PRODUCT_ID] === product[PRODUCT_COLUMNS.ID]
      ) {

        countedQty = Number(
          detailData[i][INVENTORY_DETAIL_COLUMNS.COUNTED_QTY]
        );

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
      onHand: Number(product[PRODUCT_COLUMNS.ONHAND]),
      countedQty: countedQty
    };

  });

}
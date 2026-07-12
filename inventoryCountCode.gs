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

  const products = getActiveProducts();

  const filtered = products.filter(function(product) {

    return String(product[PRODUCT_COLUMNS.CATEGORY]).trim() ===
           String(category).trim();

  });

  return filtered.map(function(product) {

    return {

  productId: product[PRODUCT_COLUMNS.ID],
  sku: product[PRODUCT_COLUMNS.SKU],
  category: product[PRODUCT_COLUMNS.CATEGORY],
  design: product[PRODUCT_COLUMNS.DESIGN],
  collection: product[PRODUCT_COLUMNS.COLLECTION],
  name: product[PRODUCT_COLUMNS.NAME],
  size: product[PRODUCT_COLUMNS.SIZE],
  onHand: Number(product[PRODUCT_COLUMNS.ONHAND])

};

  });

}
/**
 * =====================================================
 * THE BUNKER DATABASE
 * Version 0.2
 * =====================================================
 */

const PRODUCT_COLUMNS = {

  ID: 0,
  SKU: 1,
  CATEGORY: 2,
  DESIGN: 3,
  COLLECTION: 4,
  NAME: 5,
  SIZE: 6,
  COST: 7,
  PRICE: 8,
  ONHAND: 9,
  ACTIVE: 10,
  TRACKSIZE: 11,
  REORDER: 12,
  VENDOR: 13,
  NOTES: 14

};

/**
 * Returns Products sheet
 */
function getProductsSheet(){

  return SpreadsheetApp
    .getActive()
    .getSheetByName("Products");

}

/**
 * Returns all products
 */
function getProducts(){

  const sheet = getProductsSheet();

  const data = sheet.getDataRange().getValues();

  data.shift();

  return data;

}

/**
 * Returns only active products
 */
function getActiveProducts(){

  const products = getProducts();

  return products.filter(product =>

    String(product[PRODUCT_COLUMNS.ACTIVE]).toUpperCase()=="Y"

  );

}

/**
 * Search Products
 */
function searchProducts(searchText){

  const search = String(searchText).toLowerCase().trim();

  const products = getActiveProducts();

  return products.filter(product=>{

    return product.some(field=>

      String(field).toLowerCase().includes(search)

    );

  });


  return sheet;
}

function searchProducts(searchText){

  const search = String(searchText).toLowerCase().trim();

  const products = getActiveProducts();

  return products.filter(product => {

    return product.some(field =>

      String(field).toLowerCase().includes(search)

    );

  });

}

function getInventoryCountDetailsSheet() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let sheet = ss.getSheetByName("Inventory Count Details");

  if (!sheet) {

    sheet = ss.insertSheet("Inventory Count Details");

    sheet.appendRow([
      "Session ID",
      "Category",
      "Product ID",
      "SKU",
      "System Qty",
      "Counted Qty",
      "Difference",
      "Saved"
    ]);

  }

 

}
function getProductById(productId) {

  const products = getProducts();

  return products.find(product =>

    String(product[PRODUCT_COLUMNS.ID]) === String(productId)

  ) || null;

}

function addProduct(product) {
  if (!product) {
  throw new Error("Product object is required.");
}

  const sheet = getProductsSheet();

  const lastRow = sheet.getLastRow();

  const newId = Utilities.getUuid();

  sheet.appendRow([
    newId,
    product.sku,
    product.category,
    product.design,
    product.collection,
    product.name,
    product.size,
    product.cost,
    product.price,
    product.onHand,
    "Y",
    product.trackSize,
    product.reorder,
    product.vendor,
    product.notes
  ]);

  return newId;

}

function updateProduct(product) {
  if (!product) {
  throw new Error("Product object is required.");
}

  const sheet = getProductsSheet();

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {

    if (String(data[i][PRODUCT_COLUMNS.ID]) === String(product.id)) {

      sheet.getRange(i + 1, PRODUCT_COLUMNS.CATEGORY + 1, 1, 13)
        .setValues([[
          product.category,
          product.design,
          product.collection,
          product.name,
          product.size,
          product.cost,
          product.price,
          product.onHand,
          product.active,
          product.trackSize,
          product.reorder,
          product.vendor,
          product.notes
        ]]);

      return true;

    }

  }

  return false;

}


function deleteProduct(productId) {

  const sheet = getProductsSheet();

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {

    if (String(data[i][PRODUCT_COLUMNS.ID]) === String(productId)) {

      sheet
        .getRange(i + 1, PRODUCT_COLUMNS.ACTIVE + 1)
        .setValue("N");

      return true;

    }

  }

  return false;

}

/**
 * Returns a sorted list of unique values from a Products column.
 */
function getUniqueProductColumnValues(columnIndex) {

  const products = getProducts();

  const values = products
    .map(row => String(row[columnIndex]).trim())
    .filter(value => value !== "");

  return [...new Set(values)].sort();

}

function testCategories() {
  Logger.log(
    getUniqueProductColumnValues(PRODUCT_COLUMNS.CATEGORY)
  );
}
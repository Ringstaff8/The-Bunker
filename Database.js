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
 * Returns true if the SKU already exists.
 */
function productSkuExists(sku) {

  if (!sku) return false;

  const products = getProducts();

  return products.some(product =>
    String(product[PRODUCT_COLUMNS.SKU]).trim().toUpperCase() ===
    String(sku).trim().toUpperCase()
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

  if (productSkuExists(product.sku)) {
    throw new Error("SKU already exists.");
  }

  const sheet = getProductsSheet();

const row = [

  Utilities.getUuid(),                  // Product ID
  product.sku.trim(),                   // SKU
  product.category,                     // Category
  product.design || "",                 // Design
  product.collection || "",             // Collection
  product.name.trim(),                  // Product Name
  product.size || "",                   // Size
  Number(product.cost) || 0,            // Cost
  Number(product.price) || 0,           // Price
  Number(product.onHand) || 0,          // On Hand
  product.active ? "Y" : "N",           // Active
  product.trackSize ? "Y" : "N",        // Track Size
  Number(product.reorder) || 0,         // Reorder Level
  product.vendor || "",                 // Vendor
  product.notes || ""                   // Notes

];

  sheet.appendRow(row);

  return true;

}

function updateProduct(product) {

  if (!product) {
    throw new Error("Product object is required.");
  }

  if (!product.id) {
    throw new Error("Product ID is required.");
  }

  const sheet = getProductsSheet();
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {

    if (String(data[i][0]) === String(product.id)) {

      const row = [

        product.id,                           // Product ID
        product.sku.trim(),                   // SKU
        product.category,                     // Category
        product.design || "",                 // Design
        product.collection || "",             // Collection
        product.name.trim(),                  // Product Name
        product.size || "",                   // Size
        Number(product.cost) || 0,            // Cost
        Number(product.price) || 0,           // Price
        Number(product.onHand) || 0,          // On Hand
        product.active ? "Y" : "N",           // Active
        product.trackSize ? "Y" : "N",        // Track Size
        Number(product.reorder) || 0,         // Reorder Level
        product.vendor || "",                 // Vendor
        product.notes || ""                   // Notes

      ];
      Logger.log(row);

      sheet.getRange(i + 1, 1, 1, row.length).setValues([row]);

      return true;
    }
  }

  throw new Error("Product not found.");

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

function testAddProduct() {

  addProduct({

    sku: "TEST100",

    category: "Testing",

    design: "",

    collection: "",

    name: "Test Product",

    size: "M",

    cost: 5,

    price: 10,

    onHand: 20,

    trackSize: false,

    reorder: 2,

    vendor: "Test Vendor",

    notes: "Delete me"

  });

}

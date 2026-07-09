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

}/**
 * Search Test
 */
function testSearch(){

  const results = searchProducts("t");

  Logger.log(results);

}
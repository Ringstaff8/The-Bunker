function savePromotionInfo(promo) {

  return completePromotion(promo);

}
function completePromotion(promo) {

  const productId = Number(promo.product);

  const products = getProducts();

  const product = products.find(function(item) {
    return Number(item[PRODUCT_COLUMNS.ID]) === productId;
  });

  if (!product) {
    throw new Error("Product not found.");
  }

  const productSheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Products");

  const rowIndex = products.findIndex(function(item) {
    return Number(item[PRODUCT_COLUMNS.ID]) === productId;
  });

  if (rowIndex === -1) {
    throw new Error("Product row not found.");
  }

  const sheetRow = rowIndex + 2; // Account for header row

  const currentQty = Number(
    productSheet.getRange(sheetRow, 10).getValue()
  );

  if (currentQty < 1) {
    throw new Error("No inventory available.");
  }

  productSheet
    .getRange(sheetRow, 10)
    .setValue(currentQty - 1);

  return product[PRODUCT_COLUMNS.NAME];

}
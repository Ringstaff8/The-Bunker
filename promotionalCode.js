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

  throw new Error(
    product[PRODUCT_COLUMNS.NAME] +
    " is out of stock."
  );

}

  productSheet
    .getRange(sheetRow, 10)
    .setValue(currentQty - 1);

      const transactionSheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Transactions");

  const transactionID = Utilities.getUuid();

  const now = new Date();

  const saleDate = Utilities.formatDate(
    now,
    Session.getScriptTimeZone(),
    "MM/dd/yyyy"
  );

  const saleTime = Utilities.formatDate(
    now,
    Session.getScriptTimeZone(),
    "hh:mm:ss a"
  );

  const notes =
    "Student: " + promo.student +
    " | Reason: " + promo.reason +
    (promo.notes ? " | " + promo.notes : "");

  transactionSheet.appendRow([

    transactionID,                    // A Transaction ID

    "Promotional",                    // B Transaction Type

    saleDate,                         // C Date

    saleTime,                         // D Time

    product[PRODUCT_COLUMNS.ID],      // E Product ID

    product[PRODUCT_COLUMNS.SKU],     // F SKU

    product[PRODUCT_COLUMNS.CATEGORY],// G Category

    product[PRODUCT_COLUMNS.DESIGN],  // H Design

    product[PRODUCT_COLUMNS.COLLECTION], // I Collection

    product[PRODUCT_COLUMNS.NAME],    // J Product Name

    product[PRODUCT_COLUMNS.SIZE],    // K Size

    1,                                // L Quantity

    product[PRODUCT_COLUMNS.COST],    // M Cost

    0,                                // N Price

    -Number(product[PRODUCT_COLUMNS.COST]), // O Profit

    "Promotional",                    // P Payment Type

    Session.getActiveUser().getEmail(), // Q User

    notes                             // R Notes

  ]);

  return product[PRODUCT_COLUMNS.NAME];

}
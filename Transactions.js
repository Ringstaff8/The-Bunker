/**
 * ==========================================================
 * THE BUNKER
 * Transactions.gs
 * Beta 1.0
 * ==========================================================
 */

function completeSale(cart, paymentType) {

  if (!cart || cart.length === 0) {
    throw new Error("Cart is empty.");
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const transactionSheet = ss.getSheetByName("Transactions");
  const productSheet = ss.getSheetByName("Products");

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

  const productData = productSheet.getDataRange().getValues();

  cart.forEach(item => {

    //----------------------------------------------------
    // Find Product Row
    //----------------------------------------------------

    let rowIndex = -1;

    for (let r = 1; r < productData.length; r++) {

      if (productData[r][0] == item.id) {

        rowIndex = r + 1;

        break;

      }

    }

    if (rowIndex == -1) {

      throw new Error("Product not found: " + item.name);

    }

    //----------------------------------------------------
    // Inventory Check
    //----------------------------------------------------

    const currentQty = Number(productSheet.getRange(rowIndex,10).getValue());

    if (currentQty < item.qty) {

      throw new Error(item.name + " does not have enough inventory.");

    }

    //----------------------------------------------------
    // Update Inventory
    //----------------------------------------------------

    productSheet
      .getRange(rowIndex,10)
      .setValue(currentQty - item.qty);

    //----------------------------------------------------
    // Calculate Profit
    //----------------------------------------------------

    const profit =
      (item.price - item.cost) * item.qty;

    //----------------------------------------------------
    // Write Transaction
    //----------------------------------------------------

    transactionSheet.appendRow([

      transactionID,             // A Transaction ID

      "Sale",                    // B Transaction Type

      saleDate,                  // C Date

      saleTime,                  // D Time

      item.id,                   // E Product ID

      item.sku,                  // F SKU

      item.category,             // G Category

      item.design,               // H Design

      item.collection,           // I Collection

      item.name,                 // J Product Name

      item.size,                 // K Size

      item.qty,                  // L Quantity

      item.cost,                 // M Cost

      item.price,                // N Price

      profit,                    // O Profit

      paymentType,               // P Payment Type

      Session.getActiveUser().getEmail(), // Q User

      ""                         // R Notes

    ]);

  });

  return true;

}
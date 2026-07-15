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

function createInventoryAdjustment(product, difference) {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const transactionSheet = ss.getSheetByName("Transactions");

  const transactionID = Utilities.getUuid();

  const now = new Date();

  const transactionDate = Utilities.formatDate(
    now,
    Session.getScriptTimeZone(),
    "MM/dd/yyyy"
  );

  const transactionTime = Utilities.formatDate(
    now,
    Session.getScriptTimeZone(),
    "hh:mm:ss a"
  );

  transactionSheet.appendRow([

    transactionID,                          // A Transaction ID

    "Inventory Adjustment",                 // B Transaction Type

    transactionDate,                        // C Date

    transactionTime,                        // D Time

    product.productId,                      // E Product ID

    product.sku,                            // F SKU

    product.category,                       // G Category

    product.design,                         // H Design

    product.collection,                     // I Collection

    product.name,                           // J Product Name

    product.size,                           // K Size

    difference,                             // L Quantity (+/- Adjustment)

    product.cost,                           // M Cost

    0,                                      // N Price

    0,                                      // O Profit

    "Inventory",                            // P Payment Type

    Session.getActiveUser().getEmail(),     // Q User

    "Physical Inventory Count"              // R Notes

  ]);

}

function testCreateInventoryAdjustment() {

  createInventoryAdjustment({

    productId: 9999,
    sku: "TEST-001",
    category: "Test",
    design: "Test",
    collection: "Test",
    name: "Inventory Test",
    size: "NA",
    cost: 1.25

  }, -2);

}

function getTransactions() {

  const sheet = SpreadsheetApp
    .getActive()
    .getSheetByName("Transactions");

  const data = sheet.getDataRange().getValues();

  data.shift();

  return data;

}

function getRecentActivity(limit = 10) {

  const transactions = getTransactions();

  return transactions
    .slice()
    .reverse()
    .slice(0, limit)
    .map(function(row) {

      return {
        transactionType: String(row[1]),
        time: String(row[3]),
        productName: String(row[8]),
        quantity: Number(row[11]) || 0,
        paymentType: String(row[15])
      };

    });

}
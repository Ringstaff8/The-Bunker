/**
 * ==========================================================
 * THE BUNKER
 * Reports.gs
 * Beta 1.0
 * ==========================================================
 */

/**
 * Opens the Reports screen.
 */
function showReports() {

  showDialog(
    "reports",
    "📊 Reports",
    1400,
    900
  );

}

function showInventoryVarianceReport() {

  showDialog(
    "inventoryVariance",
    "Inventory Variance Report",
    900,
    650
  );

}

function showLowStockReport() {

  showDialog(
    "lowStockReport",
    "Low Stock Report",
    1100,
    650
  );

}

function showTransactionHistoryReport() {

  showDialog(
    "transactionHistory",
    "Transaction History",
    1200,
    700
  );

}

function showSalesReport() {

  showDialog(
    "salesReport",
    "Sales Report",
    1100,
    700
  );

}

function showInventoryValuationReport() {

  showDialog(
    "inventoryValuation",
    "Inventory Valuation Report",
    1100,
    700
  );

}


function showInventoryAdjustmentReport() {

  showDialog(
    "inventoryAdjustmentEntry",
    "Inventory Adjustment",
    1100,
    700
  );

}

function showReports() {

  const html = HtmlService
    .createTemplateFromFile("reports")
    .evaluate()
    .setWidth(1400)
    .setHeight(900);

  SpreadsheetApp.getUi().showModalDialog(
    html,
    "≡ƒôè Reports"
  );

}


/**
 * Returns summary statistics for reports.
 */
function getReportSummary() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const sheet = ss.getSheetByName("Transactions");

  if (!sheet || sheet.getLastRow() <= 1) {

    return {

      totalSales: 0,
      totalRevenue: 0,
      totalProfit: 0,
      promotionalItems: 0

    };

  }

  const data = sheet.getDataRange().getValues();

  data.shift();

  let revenue = 0;
  let profit = 0;
  let items = 0;
  let promo = 0;

  data.forEach(row => {

    const type = row[1];
    const qty = Number(row[11]);
    const cost = Number(row[12]);
    const price = Number(row[13]);

    items += qty;

    if (type === "Promotional") {

      promo += qty;

    } else {

      revenue += price * qty;
      profit += (price - cost) * qty;

    }

  });

  return {

    totalSales: items,
    totalRevenue: revenue,
    totalProfit: profit,
    promotionalItems: promo

  };

}


/**
 * Returns the top-selling products.
 */
function getTopSellingProducts(limit) {

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const sheet = ss.getSheetByName("Transactions");

  if (!sheet || sheet.getLastRow() <= 1) {

    return [];

  }

  const data = sheet.getDataRange().getValues();

  data.shift();

  const totals = {};

  data.forEach(row => {

    const name = row[9];
    const qty = Number(row[11]);

    if (!totals[name]) {

      totals[name] = 0;

    }

    totals[name] += qty;

  });

  const list = Object.keys(totals).map(name => {

    return {

      product: name,
      quantity: totals[name]

    };

  });

  list.sort(function(a, b) {

    return b.quantity - a.quantity;

  });

  return list.slice(0, limit || 10);

}


/**
 * Returns products below reorder level.
 */
function getLowStockReport() {

  const products = getProducts();

  return products
    .filter(function(product) {

      const onHand = Number(product[PRODUCT_COLUMNS.ONHAND]) || 0;
      const reorderLevel = Number(product[PRODUCT_COLUMNS.REORDER]) || 0;

      const active =
        String(product[PRODUCT_COLUMNS.ACTIVE]).trim().toUpperCase() === "Y";

      return active && onHand <= reorderLevel;

    })
    .map(function(product) {

      const onHand = Number(product[PRODUCT_COLUMNS.ONHAND]) || 0;
      const reorderLevel = Number(product[PRODUCT_COLUMNS.REORDER]) || 0;

      return {
        sku: product[PRODUCT_COLUMNS.SKU],
        category: product[PRODUCT_COLUMNS.CATEGORY],
        design: product[PRODUCT_COLUMNS.DESIGN],
        collection: product[PRODUCT_COLUMNS.COLLECTION],
        productName: product[PRODUCT_COLUMNS.NAME],
        size: product[PRODUCT_COLUMNS.SIZE],
        onHand: onHand,
        reorderLevel: reorderLevel,
        difference: reorderLevel - onHand
      };

    })
    .sort(function(a, b) {

      return b.difference - a.difference;

    });

}

function getInventoryVariance() {

  const session = getLastCompletedInventorySession();

  if (!session) {
    throw new Error("No completed inventory session found.");
  }

  const detailSheet = getInventoryCountDetailsSheet();
  const detailData = detailSheet.getDataRange().getValues();

  const productData = getProductsSheet().getDataRange().getValues();

  const results = [];

  for (let i = 1; i < detailData.length; i++) {

    if (
      detailData[i][INVENTORY_DETAIL_COLUMNS.SESSION_ID] !== session.sessionId
    ) {
      continue;
    }

    const productId =
      detailData[i][INVENTORY_DETAIL_COLUMNS.PRODUCT_ID];

    let product = null;

    for (let p = 1; p < productData.length; p++) {

      if (
        productData[p][PRODUCT_COLUMNS.ID] === productId
      ) {
        product = productData[p];
        break;
      }

    }

    if (!product) {
      continue;
    }

    results.push({
productId: product[PRODUCT_COLUMNS.ID],
      category: product[PRODUCT_COLUMNS.CATEGORY],
      sku: product[PRODUCT_COLUMNS.SKU],
      design: product[PRODUCT_COLUMNS.DESIGN],
      collection: product[PRODUCT_COLUMNS.COLLECTION],
      name: product[PRODUCT_COLUMNS.NAME],
      size: product[PRODUCT_COLUMNS.SIZE],

      systemQty: Number(
        detailData[i][INVENTORY_DETAIL_COLUMNS.SYSTEM_QTY]
      ),

      countedQty: Number(
        detailData[i][INVENTORY_DETAIL_COLUMNS.COUNTED_QTY]
      ),

      difference: Number(
        detailData[i][INVENTORY_DETAIL_COLUMNS.DIFFERENCE]
      )

    });

  }

  return results;

}
function getTransactionHistory() {

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Transactions");

  if (!sheet) {
    throw new Error("Transactions sheet not found.");
  }

  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    return [];
  }

  // Remove header row
  data.shift();


return data.map(function(row) {

  return {

    transactionId: String(row[0] || ""),
    transactionType: String(row[1] || ""),
    date: String(row[2] || ""),
    time: String(row[3] || ""),
    productId: String(row[4] || ""),
    sku: String(row[5] || ""),
    category: String(row[6] || ""),
    design: String(row[7] || ""),
    productName: String(row[9] || ""),
    collection: String(row[8] || ""),
    size: String(row[10] || ""),
    quantity: Number(row[11]) || 0,
    cost: Number(row[12]) || 0,
    price: Number(row[13]) || 0,
    profit: Number(row[14]) || 0,
    paymentType: String(row[15] || ""),
    user: String(row[16] || ""),
    notes: String(row[17] || "")

  };

});
}

function getSalesReport(startDate, endDate) {

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Transactions");

  if (!sheet) {
    throw new Error("Transactions sheet not found.");
  }

  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    return {
      totalRevenue: 0,
      totalProfit: 0,
      totalUnits: 0,
      totalTransactions: 0,
      averageSale: 0,
      transactions: []
    };
  }

  // Remove header row
  data.shift();

  const startParts = startDate.split("-").map(Number);
const start = new Date(
  startParts[0],
  startParts[1] - 1,
  startParts[2]
);
start.setHours(0, 0, 0, 0);

const endParts = endDate.split("-").map(Number);
const end = new Date(
  endParts[0],
  endParts[1] - 1,
  endParts[2]
);
end.setHours(23, 59, 59, 999);


  let totalRevenue = 0;
  let totalProfit = 0;
  let totalUnits = 0;

  const transactionIds = new Set();
  const transactions = [];

 data.forEach(function(row) {

    const transactionDate = new Date(row[2]);

    // Skip rows outside the selected range
    if (transactionDate < start || transactionDate > end) {
      return;
    }

    const transactionType = String(row[1] || "").trim();

    if (transactionType !== "Sale") {
      return;
    }

    const quantity = Number(row[11]) || 0;
    const price = Number(row[13]) || 0;
    const profit = Number(row[14]) || 0;

    totalRevenue += quantity * price;
    totalProfit += quantity * profit;
    totalUnits += quantity;

    transactionIds.add(String(row[0]));

    transactions.push({

      transactionId: String(row[0] || ""),

      date: Utilities.formatDate(
        transactionDate,
        Session.getScriptTimeZone(),
        "MM/dd/yyyy"
      ),

      productName: String(row[9] || ""),
      quantity: quantity,
      revenue: quantity * price,
      profit: quantity * profit,
      paymentType: String(row[15] || "")

    });

  });

  const totalTransactions = transactionIds.size;

  return {

    totalRevenue: totalRevenue,
    totalProfit: totalProfit,
    totalUnits: totalUnits,
    totalTransactions: totalTransactions,
    averageSale: totalTransactions === 0
      ? 0
      : totalRevenue / totalTransactions,

    transactions: transactions

  };

}

function getInventorySessionHistoryReport() {

  try {

    const sheet = getInventorySessionsSheet();
    const data = sheet.getDataRange().getValues();

    if (data.length <= 1) {

      return {
        summary: {
          totalSessions: 0,
          openSessions: 0,
          completedSessions: 0,
          lastInventory: ""
        },
        sessions: []
      };

    }

    // Remove header row
    data.shift();

    const sessions = [];

    let openSessions = 0;
    let completedSessions = 0;
    let lastInventory = null;

    data.forEach(function(row) {

      sessions.push({
        sessionId: row[INVENTORY_SESSION_COLUMNS.SESSION_ID],
        started: row[INVENTORY_SESSION_COLUMNS.STARTED],
        startedBy: row[INVENTORY_SESSION_COLUMNS.STARTED_BY],
        status: row[INVENTORY_SESSION_COLUMNS.STATUS],
        lastUpdated: row[INVENTORY_SESSION_COLUMNS.LAST_UPDATED],
        completed: row[INVENTORY_SESSION_COLUMNS.COMPLETED]
      });

      if (row[INVENTORY_SESSION_COLUMNS.STATUS] === "OPEN") {
        openSessions++;
      }

      if (row[INVENTORY_SESSION_COLUMNS.STATUS] === "COMPLETED") {

        completedSessions++;

        const completedDate =
          row[INVENTORY_SESSION_COLUMNS.COMPLETED];

        if (
          completedDate &&
          (!lastInventory || completedDate > lastInventory)
        ) {
          lastInventory = completedDate;
        }

      }

    });

    const report = {
      summary: {
        totalSessions: sessions.length,
        openSessions: openSessions,
        completedSessions: completedSessions,
        lastInventory: lastInventory
          ? Utilities.formatDate(
              new Date(lastInventory),
              Session.getScriptTimeZone(),
              "MM/dd/yyyy"
            )
          : ""
      },
      sessions: sessions.map(function(s) {

        return {
          sessionId: String(s.sessionId || ""),
          started: s.started
            ? new Date(s.started).toISOString()
            : "",
          startedBy: String(s.startedBy || ""),
          status: String(s.status || ""),
          lastUpdated: s.lastUpdated
            ? new Date(s.lastUpdated).toISOString()
            : "",
          completed: s.completed
            ? new Date(s.completed).toISOString()
            : ""
        };

      })
    };

    return report;

  } catch (err) {

    Logger.log("getInventorySessionHistoryReport() failed");
    Logger.log(err);
    Logger.log(err.stack);

    throw err;

  }

}

function getInventoryValuationReport() {

  const products = getActiveProducts();

  let totalProducts = 0;
  let totalUnits = 0;
  let totalCost = 0;
  let totalRetail = 0;

  const reportProducts = [];

  products.forEach(function(product) {

    const qty = Number(product[PRODUCT_COLUMNS.ONHAND]) || 0;
    const cost = Number(product[PRODUCT_COLUMNS.COST]) || 0;
    const price = Number(product[PRODUCT_COLUMNS.PRICE]) || 0;

    const inventoryCost = qty * cost;
    const inventoryRetail = qty * price;
    const expectedProfit = inventoryRetail - inventoryCost;

    totalProducts++;
    totalUnits += qty;
    totalCost += inventoryCost;
    totalRetail += inventoryRetail;

    reportProducts.push({

      sku: product[PRODUCT_COLUMNS.SKU],
      collection: product[PRODUCT_COLUMNS.COLLECTION],
      product: product[PRODUCT_COLUMNS.NAME],
      size: product[PRODUCT_COLUMNS.SIZE],

      qty: qty,
      cost: cost,
      price: price,

      inventoryCost: inventoryCost,
      inventoryRetail: inventoryRetail,
      expectedProfit: expectedProfit

    });

  });

  reportProducts.sort(function(a, b) {
    return a.collection.localeCompare(b.collection) ||
           a.product.localeCompare(b.product) ||
           a.size.localeCompare(b.size);
  });

  return {

    summary: {

      totalProducts: totalProducts,
      totalUnits: totalUnits,
      totalCost: totalCost,
      totalRetail: totalRetail,
      expectedProfit: totalRetail - totalCost

    },

    products: reportProducts

  };

}
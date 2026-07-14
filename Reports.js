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

  const html = HtmlService
    .createTemplateFromFile("reports")
    .evaluate()
    .setWidth(1400)
    .setHeight(900);

  SpreadsheetApp.getUi().showModalDialog(
    html,
    "📊 Reports"
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
      const active = product[PRODUCT_COLUMNS.ACTIVE];

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

function testGetInventoryVariance() {

  Logger.log(
    JSON.stringify(getInventoryVariance(), null, 2)
  );

}

function showInventoryVarianceReport() {

  const template =
    HtmlService.createTemplateFromFile("inventoryVariance");

  const html = template
    .evaluate()
    .setWidth(900)
    .setHeight(650);

  SpreadsheetApp.getUi().showModalDialog(
    html,
    "Inventory Variance Report"
  );

}

function showLowStockReport() {

  const html = HtmlService
    .createHtmlOutputFromFile("lowStockReport")
    .setWidth(1100)
    .setHeight(650);

  SpreadsheetApp.getUi().showModalDialog(
    html,
    "Low Stock Report"
  );

}

function testLowStockReport() {
  Logger.log(getLowStockReport());
}

function showTransactionHistoryReport() {

  const html = HtmlService
    .createHtmlOutputFromFile("transactionHistory")
    .setWidth(1200)
    .setHeight(700);

  SpreadsheetApp.getUi().showModalDialog(
    html,
    "Transaction History"
  );

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
    productName: String(row[8] || ""),
    collection: String(row[9] || ""),
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


function testTransactionHistory() {
  Logger.log(getTransactionHistory().length);
}

function showSalesReport() {

  const html = HtmlService
    .createTemplateFromFile("salesReport")
    .evaluate()
    .setWidth(1100)
    .setHeight(700);

  SpreadsheetApp.getUi().showModalDialog(
    html,
    "Sales Report"
  );

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

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
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

      productName: String(row[8] || ""),
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


function showInventoryAdjustmentReport() {

  SpreadsheetApp.getUi().alert(
    "🔄 Inventory Adjustment Report\n\nComing in Beta 1.1"
  );

}

function showProfitReport() {

  SpreadsheetApp.getUi().alert(
    "📈 Profit Report\n\nComing in Beta 1.1"
  );

}

function showPromotionalHistoryReport() {

  SpreadsheetApp.getUi().alert(
    "🎁 Promotional History Report\n\nComing in Beta 1.1"
  );

}

function showReportsDashboard() {

  SpreadsheetApp.getUi().alert(
    "📊 Reports Dashboard\n\nComing in Beta 1.1"
  );

}

function showInventoryValuationReport() {

  const html = HtmlService
    .createHtmlOutputFromFile("inventoryValuation")
    .setWidth(1100)
    .setHeight(700);

  SpreadsheetApp.getUi().showModalDialog(
    html,
    "Inventory Valuation Report"
  );

}

function getInventoryValuationReport() {
  const products = getProducts();

  const activeProducts = products.filter(product => product[PRODUCT_COLUMNS.ACTIVE]);

  activeProducts.sort((a, b) => {

    const category = String(a[PRODUCT_COLUMNS.CATEGORY]).localeCompare(
      String(b[PRODUCT_COLUMNS.CATEGORY])
    );
    if (category !== 0) return category;

    const collection = String(a[PRODUCT_COLUMNS.COLLECTION]).localeCompare(
      String(b[PRODUCT_COLUMNS.COLLECTION])
    );
    if (collection !== 0) return collection;

    const name = String(a[PRODUCT_COLUMNS.NAME]).localeCompare(
      String(b[PRODUCT_COLUMNS.NAME])
    );
    if (name !== 0) return name;

    return String(a[PRODUCT_COLUMNS.SIZE]).localeCompare(
      String(b[PRODUCT_COLUMNS.SIZE])
    );
  });

  let totalUnits = 0;
  let totalCost = 0;
  let totalRetail = 0;

  const reportRows = activeProducts.map(product => {

    const qty = Number(product[PRODUCT_COLUMNS.ONHAND]) || 0;
    const cost = Number(product[PRODUCT_COLUMNS.COST]) || 0;
    const price = Number(product[PRODUCT_COLUMNS.PRICE]) || 0;

    const inventoryCost = qty * cost;
    const inventoryRetail = qty * price;
    const expectedProfit = inventoryRetail - inventoryCost;

    totalUnits += qty;
    totalCost += inventoryCost;
    totalRetail += inventoryRetail;

    return {
      sku: product[PRODUCT_COLUMNS.SKU],
      category: product[PRODUCT_COLUMNS.CATEGORY],
      collection: product[PRODUCT_COLUMNS.COLLECTION],
      product: product[PRODUCT_COLUMNS.NAME],
      size: product[PRODUCT_COLUMNS.SIZE],
      qty,
      cost,
      price,
      inventoryCost,
      inventoryRetail,
      expectedProfit
    };
  });

  return {
    summary: {
      totalProducts: reportRows.length,
      totalUnits,
      totalCost,
      totalRetail,
      expectedProfit: totalRetail - totalCost
    },
    products: reportRows
  };
}

function showInventorySessionHistoryReport() {

  const html = HtmlService
    .createHtmlOutputFromFile("inventorySessionHistory")
    .setWidth(1100)
    .setHeight(700);

  SpreadsheetApp.getUi().showModalDialog(
    html,
    "Inventory Session History Report"
  );

}

function getInventorySessionHistoryReport() {

  const sheet = getInventorySessionsSheet();

  const data = sheet.getDataRange().getValues();

  data.shift(); // Remove header row

  const sessions = data
  .filter(row => row[INVENTORY_SESSION_COLUMNS.SESSION_ID])
  .map(row => ({

  sessionId: String(row[INVENTORY_SESSION_COLUMNS.SESSION_ID] || ""),

  started: row[INVENTORY_SESSION_COLUMNS.STARTED]
    ? new Date(row[INVENTORY_SESSION_COLUMNS.STARTED]).toISOString()
    : "",

  startedBy: String(row[INVENTORY_SESSION_COLUMNS.STARTED_BY] || ""),


  status: String(row[INVENTORY_SESSION_COLUMNS.STATUS] || ""),

  lastUpdated: row[INVENTORY_SESSION_COLUMNS.LAST_UPDATED]
    ? new Date(row[INVENTORY_SESSION_COLUMNS.LAST_UPDATED]).toISOString()
    : "",

  completed: row[INVENTORY_SESSION_COLUMNS.COMPLETED]
    ? new Date(row[INVENTORY_SESSION_COLUMNS.COMPLETED]).toISOString()
    : ""

}));
  // Newest session first
  sessions.sort((a, b) => new Date(b.started) - new Date(a.started));

  const totalSessions = sessions.length;

  const openSessions = sessions.filter(
    s => String(s.status).toUpperCase() !== "COMPLETED"
  ).length;

  const completedSessions = sessions.filter(
    s => String(s.status).toUpperCase() === "COMPLETED"
  ).length;

  return {

    summary: {

      totalSessions,

      openSessions,

      completedSessions,

      lastInventory:
        sessions.length > 0 ? sessions[0].started : ""

    },

    sessions

  };

}


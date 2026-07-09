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

  return getLowStockProducts();

}
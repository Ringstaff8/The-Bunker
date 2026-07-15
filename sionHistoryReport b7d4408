/**
 * Starts a new inventory session.
 */
const INVENTORY_SESSION_COLUMNS = {
  SESSION_ID: 0,
  STARTED: 1,
  STARTED_BY: 2,
  PROGRESS: 3,
  STATUS: 4,
  LAST_UPDATED: 5,
  COMPLETED: 6
};

const INVENTORY_DETAIL_COLUMNS = {
  SESSION_ID: 0,
  CATEGORY: 1,
  PRODUCT_ID: 2,
  SKU: 3,
  SYSTEM_QTY: 4,
  COUNTED_QTY: 5,
  DIFFERENCE: 6,
  SAVED: 7
};

function createInventorySession() {

  const sheet = getInventorySessionsSheet();

  const sessionId = Utilities.getUuid();
  const now = new Date();
  const user = Session.getActiveUser().getEmail() || "Unknown";

  sheet.appendRow([
    sessionId,
    now,
    user,
   "0 / " + loadCategories().length + " Categories",
    "OPEN",
    now,
    ""
  ]);

  return {
    success: true,
    sessionId: sessionId
  };

}

function getOpenInventorySession() {

  const sheet = getInventorySessionsSheet();
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    return null;
  }

  for (let i = data.length - 1; i >= 1; i--) {

    if (
      data[i][INVENTORY_SESSION_COLUMNS.STATUS] === "OPEN"
    ) {

      return {
        sessionId: data[i][INVENTORY_SESSION_COLUMNS.SESSION_ID],
        started: data[i][INVENTORY_SESSION_COLUMNS.STARTED],
        startedBy: data[i][INVENTORY_SESSION_COLUMNS.STARTED_BY],
        progress: data[i][INVENTORY_SESSION_COLUMNS.PROGRESS],
        status: data[i][INVENTORY_SESSION_COLUMNS.STATUS],
        updated: data[i][INVENTORY_SESSION_COLUMNS.LAST_UPDATED]
      };

    }

  }

  return null;

}

function saveInventoryCategory(sessionId, category, rows) {

  const detailSheet = getInventoryCountDetailsSheet();
  const detailData = detailSheet.getDataRange().getValues();

  // Remove any existing records for this session/category
  for (let i = detailData.length - 1; i >= 1; i--) {

    if (
      detailData[i][INVENTORY_DETAIL_COLUMNS.SESSION_ID] === sessionId &&
      detailData[i][INVENTORY_DETAIL_COLUMNS.CATEGORY] === category
    ) {
      detailSheet.deleteRow(i + 1);
    }

  }

  // Save the new rows
  rows.forEach(row => {

    detailSheet.appendRow([
      sessionId,
      category,
      row.productId,
      row.sku,
      row.systemQty,
      row.countedQty,
      row.countedQty - row.systemQty,
      new Date()
    ]);

  });

  // Update session information
  const sessionSheet = getInventorySessionsSheet();
  const sessionData = sessionSheet.getDataRange().getValues();

  // Count completed categories
  const refreshedData = detailSheet.getDataRange().getValues();
  const completedCategories = new Set();

  for (let i = 1; i < refreshedData.length; i++) {

    if (
      refreshedData[i][INVENTORY_DETAIL_COLUMNS.SESSION_ID] === sessionId
    ) {
      completedCategories.add(
        refreshedData[i][INVENTORY_DETAIL_COLUMNS.CATEGORY]
      );
    }

  }

  const totalCategories = loadCategories().length;
  const progress =
    completedCategories.size + " / " + totalCategories + " Categories";

  // Update the session record
  for (let i = 1; i < sessionData.length; i++) {

    if (
      sessionData[i][INVENTORY_SESSION_COLUMNS.SESSION_ID] === sessionId
    ) {

      sessionSheet.getRange(
        i + 1,
        INVENTORY_SESSION_COLUMNS.PROGRESS + 1
      ).setValue(progress);

      sessionSheet.getRange(
        i + 1,
        INVENTORY_SESSION_COLUMNS.LAST_UPDATED + 1
      ).setValue(new Date());

      break;
    }

  }

  return {
    success: true,
    recordsSaved: rows.length,
    progress: progress
  };

}
function saveInventoryCount(category, rows) {

  const session = getOrCreateInventorySession();

  const result = saveInventoryCategory(
    session.sessionId,
    category,
    rows
  );

  return result;

}

function getInventorySessionsSheet() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let sheet = ss.getSheetByName("Inventory Sessions");

  if (!sheet) {

    sheet = ss.insertSheet("Inventory Sessions");

    sheet.appendRow([
      "Session ID",
      "Started",
      "Started By",
      "Progress",
      "Status",
      "Last Updated",
      "Completed"
    ]);

  }

  return sheet;

}


function getOrCreateInventorySession() {

  let session = getOpenInventorySession();

  if (session) {
    return session;
  }

  createInventorySession();

  return getOpenInventorySession();

}
function testGetOrCreateInventorySession() {
  try {
    const session = getOrCreateInventorySession();

    Logger.log("SUCCESS");
    Logger.log(JSON.stringify(session));

    return session;

  } catch (err) {

    Logger.log("ERROR");
    Logger.log(err);
    throw err;

  }
}
function getCurrentInventorySession() {

  const session = getOrCreateInventorySession();

  Logger.log("getCurrentInventorySession called");
  Logger.log(JSON.stringify(session));

  return session;

}

function testGetCurrentInventorySession() {

  const session = getCurrentInventorySession();

  Logger.log(session);

}

function applyInventoryCount() {

  const session = getOpenInventorySession();

  if (!session) {
    throw new Error("No open inventory session found.");
  }

  const detailSheet = getInventoryCountDetailsSheet();
  const detailData = detailSheet.getDataRange().getValues();

  const productsSheet = getProductsSheet();
  const productData = productsSheet.getDataRange().getValues();

  const sessionSheet = getInventorySessionsSheet();
  const sessionData = sessionSheet.getDataRange().getValues();

  let updated = 0;
  let adjustments = 0;

  for (let i = 1; i < detailData.length; i++) {

    if (
      detailData[i][INVENTORY_DETAIL_COLUMNS.SESSION_ID] !== session.sessionId
    ) {
      continue;
    }

    const productId =
      detailData[i][INVENTORY_DETAIL_COLUMNS.PRODUCT_ID];

    const systemQty =
      Number(detailData[i][INVENTORY_DETAIL_COLUMNS.SYSTEM_QTY]);

    const countedQty =
      Number(detailData[i][INVENTORY_DETAIL_COLUMNS.COUNTED_QTY]);

    const difference = countedQty - systemQty;

    for (let p = 1; p < productData.length; p++) {

      if (productData[p][PRODUCT_COLUMNS.ID] === productId) {

        // Update inventory
        productsSheet.getRange(
          p + 1,
          PRODUCT_COLUMNS.ONHAND + 1
        ).setValue(countedQty);

        updated++;

        // Record adjustment only if inventory changed
        if (difference !== 0) {

          createInventoryAdjustment({

            productId: productData[p][PRODUCT_COLUMNS.ID],
            sku: productData[p][PRODUCT_COLUMNS.SKU],
            category: productData[p][PRODUCT_COLUMNS.CATEGORY],
            design: productData[p][PRODUCT_COLUMNS.DESIGN],
            collection: productData[p][PRODUCT_COLUMNS.COLLECTION],
            name: productData[p][PRODUCT_COLUMNS.NAME],
            size: productData[p][PRODUCT_COLUMNS.SIZE],
            cost: Number(productData[p][PRODUCT_COLUMNS.COST])

          }, difference);

          adjustments++;

        }

        break;

      }

    }

  }

  // Mark session completed
  for (let i = 1; i < sessionData.length; i++) {

    if (
      sessionData[i][INVENTORY_SESSION_COLUMNS.SESSION_ID] === session.sessionId
    ) {

      sessionSheet.getRange(
        i + 1,
        INVENTORY_SESSION_COLUMNS.STATUS + 1
      ).setValue("COMPLETED");

      sessionSheet.getRange(
        i + 1,
        INVENTORY_SESSION_COLUMNS.COMPLETED + 1
      ).setValue(new Date());

      sessionSheet.getRange(
        i + 1,
        INVENTORY_SESSION_COLUMNS.LAST_UPDATED + 1
      ).setValue(new Date());

      break;

    }

  }

  return {

    success: true,
    updated: updated,
    adjustments: adjustments

  };

}

function testApplyInventoryCount() {
  Logger.log(applyInventoryCount());
}

function getLastCompletedInventorySession() {

  const sheet = getInventorySessionsSheet();
  const data = sheet.getDataRange().getValues();

  for (let i = data.length - 1; i >= 1; i--) {

    if (
      data[i][INVENTORY_SESSION_COLUMNS.STATUS] === "COMPLETED"
    ) {

      return {
        sessionId: data[i][INVENTORY_SESSION_COLUMNS.SESSION_ID],
        started: data[i][INVENTORY_SESSION_COLUMNS.STARTED],
        completed: data[i][INVENTORY_SESSION_COLUMNS.COMPLETED]
      };

    }

  }

  return null;

}
function testLastCompletedInventorySession() {

  Logger.log(
    JSON.stringify(getLastCompletedInventorySession())
  );

}

function getLastCompletedInventorySession() {

  const sheet = getInventorySessionsSheet();
  const data = sheet.getDataRange().getValues();

  for (let i = data.length - 1; i >= 1; i--) {

    if (
      data[i][INVENTORY_SESSION_COLUMNS.STATUS] === "COMPLETED"
    ) {

      return {
        sessionId: data[i][INVENTORY_SESSION_COLUMNS.SESSION_ID],
        started: data[i][INVENTORY_SESSION_COLUMNS.STARTED],
        startedBy: data[i][INVENTORY_SESSION_COLUMNS.STARTED_BY],
        progress: data[i][INVENTORY_SESSION_COLUMNS.PROGRESS],
        status: data[i][INVENTORY_SESSION_COLUMNS.STATUS],
        updated: data[i][INVENTORY_SESSION_COLUMNS.LAST_UPDATED],
        completed: data[i][INVENTORY_SESSION_COLUMNS.COMPLETED]
      };

    }

  }

  return null;

}
function testGetLastCompletedInventorySession() {

  const session = getLastCompletedInventorySession();

  Logger.log(JSON.stringify(session));

}

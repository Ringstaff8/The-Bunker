/**
 * ==========================================================
 * THE BUNKER
 * Code.gs
 * Beta 1.0
 *
 * Main startup file
 * ==========================================================
 */

/**
 * Runs every time the spreadsheet opens.
 */
/**
/**
 * Application Constants
 *
 * Branding information is now maintained in Branding.gs.
 * This object remains only for application-level settings.
 */
const APP = Object.freeze({

  DEBUG: false

});


function onOpen(e) {

  createBunkerMenu();

}

/**
 * Quick launcher while developing.
 * Select this function from the Run menu to rebuild the menu.
 */
function initializeBunker() {

  createBunkerMenu();

  SpreadsheetApp.getUi().alert(
    "The Bunker Beta 1 initialized successfully."
  );

}

/**
 * Development helper.
 * Opens the Dashboard directly.
 */
function testDashboard() {

  showDashboard();

}

/**
 * Development helper.
 * Opens the Ring Up Sale screen directly.
 */
function testSales() {

  showSales();

}

function doGet(e) {

  const page =
    e && e.parameter && e.parameter.page
      ? e.parameter.page
      : "dashboard";

  const allowedPages = [
    "dashboard",
    "sales"
  ];

  const fileName =
    allowedPages.includes(page)
      ? page
      : "dashboard";

  return HtmlService
    .createTemplateFromFile(fileName)
    .evaluate()
    .setTitle("The Bunker")
    .setXFrameOptionsMode(
      HtmlService.XFrameOptionsMode.ALLOWALL
    );

}

function getWebAppUrl() {

  return ScriptApp
    .getService()
    .getUrl();

}
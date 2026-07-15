/**
 * ==========================================================
 * THE BUNKER
 * Utilities.gs
 * Beta 1.0
 * ==========================================================
 */


/**
 * Returns the active spreadsheet.
 */
function getSpreadsheet() {

  return SpreadsheetApp.getActiveSpreadsheet();

}


/**
 * Returns today's date.
 */
function getToday() {

  return new Date();

}


/**
 * Formats a number as currency.
 */
function formatCurrency(value) {

  return Number(value).toFixed(2);

}


/**
 * Formats today's date.
 */
function formatDate(date) {

  return Utilities.formatDate(

    date,

    Session.getScriptTimeZone(),

    "MM/dd/yyyy"

  );

}


/**
 * Formats time.
 */
function formatTime(date) {

  return Utilities.formatDate(

    date,

    Session.getScriptTimeZone(),

    "hh:mm:ss a"

  );

}


/**
 * Creates a unique Transaction ID.
 */
function generateTransactionID() {

  return Utilities.getUuid();

}


/**
 * Returns TRUE if value is empty.
 */
function isBlank(value) {

  return value === "" ||

         value === null ||

         value === undefined;

}


/**
 * Converts Yes/No values to Boolean.
 */
function yesNoToBoolean(value) {

  if (value === true) return true;

  return String(value).toUpperCase() === "Y";

}


/**
 * Converts Boolean to Yes/No.
 */
function booleanToYesNo(value) {

  return value ? "Y" : "N";

}

/**
 * Displays an informational message.
 */
function showMessage(title, message) {

  SpreadsheetApp
    .getUi()
    .alert(
      title,
      message,
      SpreadsheetApp.getUi().ButtonSet.OK
    );

}

/**
 * Displays an error message.
 */
function showError(message) {

  SpreadsheetApp
    .getUi()
    .alert(
      "The Bunker",
      message,
      SpreadsheetApp.getUi().ButtonSet.OK
    );

}

/**
 * Includes HTML files.
 */
function include(filename) {

  return HtmlService
    .createHtmlOutputFromFile(filename)
    .getContent();

}

/**
 * Opens any HTML dialog using Apps Script templates.
 *
 * @param {string} fileName HTML filename (without .html)
 * @param {string} title Dialog title
 * @param {number} width Dialog width
 * @param {number} height Dialog height
 */
function showDialog(fileName, title, width, height) {

  const html = HtmlService
    .createTemplateFromFile(fileName)
    .evaluate()
    .setWidth(width)
    .setHeight(height);

  SpreadsheetApp.getUi().showModalDialog(
    html,
    title
  );

}

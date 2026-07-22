/**
 * ==========================================================
 * THE BUNKER
 * Security.gs
 * Beta 1.1
 * ==========================================================
 */

/**
 * Opens the Promotional Items screen.
 */
function showPromotional() {

  showDialog(
    "Promotional",
    "🎁 Promotional Items",
    900,
    700
  );

}


/**
 * Returns the current user.
 */
function getCurrentUser() {

  return {
    email: Session.getActiveUser().getEmail()
  };

}


/**
 * Returns whether the current user is an administrator.
 *
 * Beta 1.1:
 * Everyone is treated as an administrator once
 * the password has been verified by the client.
 */
function isAdministrator() {

  return true;

}


/**
 * Returns the administrator password
 * from the Settings sheet.
 */
function getAdminPassword() {

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Settings");

  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {

    if (values[i][0] === "AdminPassword") {
      return String(values[i][1]).trim();
    }

  }

  throw new Error("AdminPassword not found in Settings sheet.");

}


/**
 * Verifies the administrator password.
 */
function verifyAdminPassword(password) {

  return password === getAdminPassword();

}
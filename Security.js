/**
 * ==========================================================
 * THE BUNKER
 * Security.gs
 * Beta 1.0
 * ==========================================================
 */

/**
 * Beta 1 Promotional Password
 *
 * TODO:
 * Move to Settings sheet in Beta 2.
 */
const BUNKER_PASSWORD = "Tornado2026";


/**
 * Verifies the administrator password.
 *
 * Returns:
 * true  = Correct password
 * false = Incorrect password
 */
function verifyPassword(password){

  return password === BUNKER_PASSWORD;

}


/**
 * Opens the Promotional Items screen.
 *
 * Password is verified by the HTML page before
 * inventory can be removed.
 */
function showPromotional() {

  showDialog(
    "promotional",
    "🎁 Promotional Items",
    900,
    700
  );

}


/**
 * Returns the current user.
 *
 * Future versions can use this for permissions.
 */
function getCurrentUser(){

  return {

    email: Session.getActiveUser().getEmail()

  };

}


/**
 * Returns whether the current user is an administrator.
 *
 * Beta 1:
 * Everyone is treated as an administrator.
 */
function isAdministrator(){

  return true;

}
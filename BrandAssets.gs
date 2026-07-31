/**
 * ==========================================================
 * THE BUNKER
 * BrandAssets.gs
 * ==========================================================
 */

/**
 * Returns branding assets used by the Bunker interface.
 */
function getBrandAssets() {

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Settings");

  if (!sheet) {
    throw new Error("Settings sheet not found.");
  }

  const values = sheet.getDataRange().getValues();

  let logoFileId = "";

  for (let i = 1; i < values.length; i++) {

    if (String(values[i][0]).trim() === "LogoFileId") {

      logoFileId = String(values[i][1]).trim();

      break;
    }

  }

  if (!logoFileId) {
    throw new Error("LogoFileId not found in Settings sheet.");
  }

  const file = DriveApp.getFileById(logoFileId);
  const blob = file.getBlob();

  const base64 =
    Utilities.base64Encode(blob.getBytes());

  const dataUrl =
    "data:" +
    blob.getContentType() +
    ";base64," +
    base64;

  return {
    logo: dataUrl
  };

}
const NOTIFICATION_EMAIL = "jollypupsparadise@gmail.com";

const SHEETS = {
  booking: {
    name: "Bookings",
    headers: ["Timestamp", "Name", "Phone", "Care", "Service location", "Page", "User agent"],
  },
  contact: {
    name: "ContactMessages",
    headers: ["Timestamp", "Name", "Phone", "Email", "Topic", "Message", "Page", "User agent"],
  },
  errors: {
    name: "Errors",
    headers: ["Timestamp", "Type", "Reason", "Payload"],
  },
};

function doPost(event) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const payload = event && event.parameter ? event.parameter : {};
    ensureSheets();

    if (payload.website) {
      appendError(payload.type || "unknown", "Blocked honeypot submission", payload);
      return jsonResponse({ ok: true });
    }

    if (payload.type === "booking") {
      appendBooking(payload);
      sendBookingEmail(payload);
      return jsonResponse({ ok: true });
    }

    if (payload.type === "contact") {
      appendContact(payload);
      sendContactEmail(payload);
      return jsonResponse({ ok: true });
    }

    appendError(payload.type || "unknown", "Unsupported submission type", payload);
    return jsonResponse({ ok: false, error: "Unsupported submission type" });
  } catch (error) {
    appendError("exception", error.message || String(error), event && event.parameter ? event.parameter : {});
    return jsonResponse({ ok: false, error: "Submission failed" });
  } finally {
    lock.releaseLock();
  }
}

function setupJollyPupsSheets() {
  ensureSheets();
}

function ensureSheets() {
  Object.keys(SHEETS).forEach(function (key) {
    const config = SHEETS[key];
    const sheet = getOrCreateSheet(config.name);
    const currentHeaders = sheet.getRange(1, 1, 1, config.headers.length).getValues()[0];
    const hasHeaders = currentHeaders.some(function (value) {
      return value;
    });

    if (!hasHeaders) {
      sheet.getRange(1, 1, 1, config.headers.length).setValues([config.headers]);
      sheet.setFrozenRows(1);
    }
  });
}

function appendBooking(payload) {
  const sheet = getOrCreateSheet(SHEETS.booking.name);
  sheet.appendRow([
    new Date(),
    clean(payload.name),
    clean(payload.phone),
    clean(payload.care),
    clean(payload.serviceLocation),
    clean(payload.page),
    clean(payload.userAgent),
  ]);
}

function appendContact(payload) {
  const sheet = getOrCreateSheet(SHEETS.contact.name);
  sheet.appendRow([
    new Date(),
    clean(payload.name),
    clean(payload.phone),
    clean(payload.email),
    clean(payload.topic),
    clean(payload.message),
    clean(payload.page),
    clean(payload.userAgent),
  ]);
}

function appendError(type, reason, payload) {
  const sheet = getOrCreateSheet(SHEETS.errors.name);
  sheet.appendRow([new Date(), clean(type), clean(reason), JSON.stringify(payload || {})]);
}

function sendBookingEmail(payload) {
  const subject = "New Jolly Pups booking request";
  const body = [
    "A new booking request was submitted.",
    "",
    "Name: " + clean(payload.name),
    "Phone: " + clean(payload.phone),
    "Care: " + clean(payload.care),
    "Service location: " + clean(payload.serviceLocation || "Not selected"),
    "Page: " + clean(payload.page),
  ].join("\n");

  MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
}

function sendContactEmail(payload) {
  const subject = "New Jolly Pups contact message";
  const body = [
    "A new contact message was submitted.",
    "",
    "Name: " + clean(payload.name),
    "Phone: " + clean(payload.phone),
    "Email: " + clean(payload.email),
    "Topic: " + clean(payload.topic),
    "Message: " + clean(payload.message),
    "Page: " + clean(payload.page),
  ].join("\n");

  MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
}

function getOrCreateSheet(name) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
}

function clean(value) {
  return value ? String(value).trim() : "";
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

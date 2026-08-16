# Jolly Pups Google Sheets Backend

This folder contains the Google Apps Script backend for website form submissions.

## Setup

1. Create a Google Sheet for Jolly Pups website submissions.
2. In the Sheet, open `Extensions > Apps Script`.
3. Paste the contents of `Code.gs` into the Apps Script editor.
4. Run `setupJollyPupsSheets` once and approve the requested permissions.
5. Deploy with `Deploy > New deployment > Web app`.
6. Use these deployment settings:
   - Execute as: `Me`
   - Who has access: `Anyone`
7. Copy the Web App URL.
8. Paste that URL into `GOOGLE_SHEET_WEB_APP_URL` at the top of `script.js`.

The script creates and uses these tabs:

- `Bookings`
- `ContactMessages`
- `Errors`

Submissions also send email notifications to `jollypupsparadise@gmail.com`.

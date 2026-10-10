# glowup progress cards

Approved scope: optional check-ins on the same device, two dated results compared in a branded card, preview before download or sharing, and no saved photos.

The results flow offers Save this check-in. Only the three numeric landmark ratios, their definition version, a timestamp and a local identifier are persisted in `glowup.progress.v1` in localStorage. There is no automatic save, cloud history or questionnaire/model prose in this record. The latest 30 snapshots are retained. Clear saved check-ins removes only this application's history. Browser storage failures are shown without claiming success. Anyone using the same browser profile can access saved check-ins.

Users select an earlier and a later check-in and choose which measurements appear. A 1080 × 1350 PNG is created locally using the supplied glowup logo, dates, selected values and signed changes. The preview is the exact exported image. Text equivalents are available. The image has no selfie, answers, personal name, beauty grade or external tracking request. It says changes can reflect camera, pose or lighting and are not an improvement score. Replacing selections cancels stale preview creation and releases its object URL.

Download works without social accounts. Share card invokes the browser's file-sharing menu when supported; otherwise it offers the download route. Posting is the user's decision. No automatic social publishing is performed. The logo and Made with glowup footer provide attribution; no unverified public app URL is printed.

Privacy copy: “glowup does not store your photos or questionnaire answers. Progress check-ins stay on this device only when you choose to save them.” This describes application retention. Photos and answers are still transmitted to OpenAI after analysis consent; the provider's processing is separate. Server usage controls still retain short-lived HMAC visitor/time-bucket records as documented in the API contract.

Validation: persistence/minimal data, malformed or unavailable storage, 30-entry bound, app-specific clearing, chronological matching comparisons, explicit save, selection invalidation and browser sharing fallback covered by tests. Actual canvas generation and PNG download checked in the local browser with clearly labelled synthetic fixtures; mobile viewport had no horizontal overflow. Temporary QA route and synthetic local history removed. Physical phone share-sheet completion and real analysis check-ins still need live validation after secure key setup.

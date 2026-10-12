# glowup: continuation brief for another account

> Historical October 9 brief. For the October 12 GitHub/Mac transfer, start with README.md, docs/liquid-glass-design.md and docs/subscriptions.md. The current design is baby blue with the supplied liquid glass logo, the woman illustration has been removed from the interface, provider names are absent from product copy, and recommendations are subscription-gated. Native iOS/StoreKit and production subscription verification are not yet built. The older visual and subscription descriptions below are superseded.

Prepared October 9, 2026, America/Vancouver. This is a project export and a curated continuation brief, not a full ChatGPT account export or a verbatim conversation transcript.

## Start here

Use the `project/` directory from the ZIP as the working project. Read this brief, `README.md`, `docs/verification.md`, `docs/progress.md`, and `design-system/glowup/MASTER.md` before changing it. Follow the owner's requirements below. Preserve functioning behavior and approved branding. Do not restart the project from a blank template.

Suggested first message to the new assistant:

> Continue my glowup project from this export. Read START_HERE.md and the project documentation first. Preserve the supplied logo, approved ivory/charcoal/coral design, privacy wording and opt-in progress cards. Report what is implemented and what still needs setup before making changes. Use Taste Skill and UI/UX Pro Max for frontend work. Keep secrets out of chat and source. Do not infer gender or invent unsupported facial measurements. The existing private Site is owned by my previous account; verify access before attempting to use its IDs.

## Owner decisions and requests

1. Build a responsive website for a photo-based facial proportions breakdown, visible skin observations and cosmetic skincare guidance. Start with the web experience; native iOS/Android apps are a later phase.
2. The app is named **glowup**, lowercase. Use the supplied `docs/references/Glowup Logo.pdf`. The exact extracted wordmark and icon are already in `public/`; do not replace them with a generated logo.
3. Retain the owner's separate men/women reference tables and source information. They are stored in `docs/future-ratio-references.md` and `docs/references/Looksmax.pdf`. Future users choose their reference group; do not infer it from appearance. The requested future display is a comparison bar showing the measured value within or outside a reference band. Matching measurement definitions and evidence are required before implementation. These comparison bars and reference-group selection are **not yet built**.
4. Add something shareable like Strava's run maps or Spotify Wrapped. The owner selected and approved **progress cards comparing dated results**, with optional check-ins saved on the same device and no photos by default. This is implemented.
5. The owner requested removal of the provider-retention setup paragraph under consent. The approved accurate replacement is: “glowup does not store your photos or questionnaire answers. Progress check-ins stay on this device only when you choose to save them.” Preserve it. The consent still explicitly identifies sending the photo, answers and proportions to OpenAI. Do not make a claim that the external provider stores nothing.
6. Use Taste Skill, from https://github.com/Leonxlnx/taste-skill, and UI/UX Pro Max to improve the website. The owner approved warm ivory, charcoal and coral from the logo, stronger editorial typography, a larger face illustration and clearer form/progress sections. The visual refresh is implemented. The owner authorized choosing good routine options autonomously.
7. Keep the registered Site owner-private. Secure API-key configuration and live validation are still pending. Do not claim that the saved Site version is deployed.

## Implemented state

- React/Vinext website with native CSS. Responsive layout, supplied logo/favicon, generated decorative editorial illustration, locally hosted DM Sans and DM Serif Display fonts with licenses, accessible focus and reduced-motion CSS. Design tokens and reasoning are in `design-system/glowup/MASTER.md`.
- JPEG/PNG/WebP upload, maximum 10 MB, preview/replacement/restart, questionnaire, explicit consent, cancellation and stale-result protection.
- Browser MediaPipe landmarker with a classic worker and locally served pinned model/WASM assets. Single-face and pose checks, upright/EXIF image handling, aligned landmark overlay.
- Three numeric proportions: cheek width / mesh height, inner-eye gap / cheek width, mouth width / cheek width. Values are computed mathematically. They are photo estimates, not physical measurements or attractiveness scores.
- Server OpenAI Responses adapter, low-cost configurable image model (default `gpt-4o-mini`), structured response validation and cautious cosmetic observations. Recommendation reasons/usage/cautions use reviewed deterministic templates.
- Owner product/reference inputs under `data/` are empty. Product categories are shown until a valid owner catalog is supplied; no brands/prices/purchase links are invented.
- D1 atomic usage reservations, HMAC visitor identifiers, global and visitor limits, 48-hour pruning on subsequent requests. No photos or questionnaire answers are retained by the app server.
- Optional numeric check-in history in browser `localStorage` key `glowup.progress.v1`. Up to 30 dated check-ins, opt-in saving, app-specific clearing, user-selected measurements and two-date comparison. Locally generated 1080 × 1350 PNG, exact preview, download and device share support with fallback. Saved history excludes photos, answers, AI prose and landmarks.

## Verification and limitations

Latest implementation verification: **53 tests in 13 files passed**, TypeScript noEmit passed, production build passed. See `evidence/` and `docs/verification.md`.

The local browser verified real MediaPipe initialization and detection on official public QA fixtures, blank/multiple-face rejection and EXIF orientation. Progress-card rendering/download was verified with clearly labelled synthetic check-ins. Temporary QA routes and synthetic browser history were removed. Do not present those fixtures as real user results.

Visual checks included 320, 375, 768, 1024 and 1440 widths and 812 × 375 landscape, with no horizontal overflow. Measured text and button contrast meet AA thresholds for the checked token combinations; form boundaries exceed 3:1. Physical devices, OS text scaling, native share-sheet completion, broad real-photo accuracy and live provider output still need validation.

One independent read-only review of the original implementation was completed. Three important issues were repaired: MediaPipe module-worker compatibility, false rejection of cautionary wording and unsupported recommendation suitability claims. Later visual/progress changes were tested and manually checked; they have not had another independent review. Minor deferred items include broader worker-service restart coverage for usage persistence and formatting long component/library lines.

## Account-bound Site and secrets

Existing Site provenance:

- Project ID: `appgprj_6ac98755c21c8191ad7c1056d77dbad4`
- Display title: `glowup`
- Slug: `faceskin-app`
- Latest saved version: **4**
- Version ID: `appgprj_6ac98755c21c8191ad7c1056d77dbad4~appgver_6178386ba00c8191823beb71d1b656b7`
- Verified implementation source commit: `e78cd2069b8385aeda15cfb7ae485d702995b1fa`
- Deployment ID: **none**; no live Site URL was produced.

The export retains `.openai/hosting.json` as provenance. **Do not assume the destination account can access this Site or reuse its project ID.** Verify access through the destination account's Sites tools. If it cannot access the original Site, create a separate authorized destination Site in a copy of the project, retain the original metadata in this export, and use only IDs returned by the destination service. Existing Site ownership, authentication, secrets, billing and account settings are not transferred by these files.

No real API key has been supplied. Use the supported **OpenAI Developers** plugin's `openai-platform-api-key` workflow and native Site secret configuration. Never request a pasted key or write one into browser/source/logs. Configure `OPENAI_API_KEY` and a securely generated `USAGE_HMAC_SECRET` (minimum 32 characters); `.env.example` contains names and nonsecret defaults only. Configure/migrate D1, then perform consented live end-to-end validation before owner-private deployment.

The readiness endpoint currently reports setup-required until secrets and D1 are available. Do not bypass usage protection or invent a completed analysis to make the preview look functional.

## Restore and run

Requirements: Node ≥22.13, npm, Git. Dependencies are pinned in `package-lock.json`. `node_modules` is intentionally omitted. No model re-download is required: pinned public model/WASM files are included.

From `project/`, use the existing install workflow:

```text
npm run install:ci
npm test
npm run typecheck
node scripts/run-framework.mjs build
node scripts/run-framework.mjs dev
```

The source targets the existing Sites runtime and host-private identity boundary. Local desktop tooling may require the Sites plugin's execution-profile/setup helpers. See `README.md`; clean clones default to the portable execution profile. On the original Windows host, invoking the starter entrypoint directly avoided a Sites npm shim-path issue. The normal installer succeeded after disk space was restored. Reference PDFs/runtime files are excluded from Vite watch to avoid a Windows EBUSY issue.

Apply only pending D1 migrations using the destination environment's supported workflow. Do not replay an applied migration. Preserve server-only key handling and host identity enforcement.

Git history is available separately in `source-history.bundle`. It preserves original implementation history; the working-tree ZIP also includes these new handoff notes. To inspect history separately:

```text
git clone source-history.bundle glowup-history
```

The project files in the ZIP are the authoritative export working snapshot. Use the history clone for provenance, then overlay the exported project files if continuing there.

## Contents and exclusions

Included: project source, tests, lockfile, model/WASM and font assets, font licenses, design documents, both source PDFs, preview screenshots, safe build/version receipt, saved build archive, Git bundle, selected design-skill sources and the original generated hero artwork.

Excluded: credentials, actual environment-value files, raw tool/chat logs, dependency caches, machine-specific execution state, private auth sessions and local quota database files. There are no real user analyses in this project export. Browser-only check-ins, if separately created in another browser/profile, are not project files and are not automatically migrated. The temporary synthetic check-ins used for QA were cleared.

The skill copies are references for continuity; follow the destination environment's installation/skill mechanism. Keep supplied licenses. This export does not install them into another account automatically.

`MANIFEST.json` contains SHA-256 checksums for every payload file (the manifest does not hash itself). `ZIP-CHECKSUM.txt` verifies the ZIP itself and is provided alongside the ZIP. Keep a local copy of the export before uploading selected files into the destination account.

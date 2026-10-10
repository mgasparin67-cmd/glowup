# Verification report — October 9, 2026

Implemented the approved responsive website with the retained Sites Vinext starter, local real landmark detection, deterministic geometry, constrained catalog/AI adapter, protected endpoint and durable D1 usage reservations. No OpenAI key has been supplied. OpenAI Developers is unavailable in this tool inventory. No live skin analysis or deployment claim is made.

## Automated checks

- 46/46 tests across 11 files pass; TypeScript noEmit passes.
- Controlled pixel ratios, aspect ratios, translation/scale, invalid coordinates, pose matrices and missing/multiple detections are tested.
- MIME/signature/10 MiB boundaries, encoded-dimension bounds, questionnaire bounds and consent are tested.
- Catalog exclusions, duplicate IDs, malformed records, unsafe purchase URLs, incomplete/refused/malformed provider results, unknown IDs, request settings, untrusted imported instructions and safe error responses are tested.
- Flow tests verify consent, duplicate clicks, resource release, replacement during detection, restart and keyless state. The generation guard also protects delayed HTTP results; that case has no separate delayed-HTTP test yet.
- Real local Miniflare/D1 admission checks enforce 5 per visitor/hour and 20 aggregate/day under concurrent requests. A new adapter sees retained counters. A full service dispose/reopen test is deferred.
- Drizzle migration generated and inspected, then applied successfully to the local preview database (four schema statements).
- Production build succeeded, and a final rebuild after QA fixes is required before packaging. Source synchronization status will be appended after the helper returns.

## Browser QA

Codex in-app browser (desktop Chromium), responsive viewport settings 375×812, 768×1024 and 1440×1000; content widths 360, 753 and 1425 after the scrollbar. No horizontal overflow. Mobile, tablet and desktop layouts visually reviewed. Local JPEG upload/preparation and questionnaire/reset work. Keyless setup state is clear and no fabricated analysis appears. Screenshots are in this folder. No physical iOS/Android devices tested.

The actual pinned MediaPipe runtime/model was initialized through a temporary local test page using Google's public portrait test asset. It returned 478 landmarks and the cheek, upper-mesh/chin, inner-eye and mouth spans aligned on the upright image. Upright JPEG and EXIF-6 rotated JPEG decoded to 820×1024; their measured ratios were respectively (.767671, .246744, .537456) and (.766766, .248762, .538561). Separate JPEG encodings explain small differences (maximum .002018); this is not bit-for-bit image equivalence or clinical validation. Blank image and two-face montage produced the expected rejection messages. Temporary test pages and portrait assets were removed from public/ before packaging; the photo was not sent to OpenAI.

A module-worker incompatibility and a real-model visibility-field mismatch were discovered and corrected, with regression tests. Classic worker assets are served locally. Six model/runtime SHA-256 hashes match their retained asset manifest. GPU initialized on the test host; CPU fallback exists but was not forced in device QA. Representative consented photos across appearances, lighting, pose and cameras remain necessary.

## Independent review

One read-only independent review, no additional implementation agents. No Critical issues; three Important findings fixed with failing then passing regressions: classic-worker compatibility, valid disclaimer handling, and unsupported recommendation safety claims. Recommendation reasons/usage/cautions now use reviewed templates; catalog usage notes cannot bypass this. Deferred minors: full service-restart test and formatting long source lines.

## Setup, privacy and source

Site registered owner-private, unpublished: appgprj_6ac98755c21c8191ad7c1056d77dbad4. Preserve its identity and audience. Local mock sign-in is development-only; production host identity injection/access policy has not been verified. Keyless readiness returns ready:false, model:gpt-4o-mini, catalogMode:categories. Secure API key and HMAC setup must use the supported native workflow before live evaluation and owner-private publication.

No user photos or questionnaire responses are persisted by the app. D1 stores HMAC visitor hashes, UTC buckets and usage attempts only. Admitted failed provider attempts remain counted; old records are pruned on subsequent reservations after 48 hours. Token/cost totals are not yet collected. OpenAI processing/retention is separate: store:false is configured but is not a zero-retention claim. Provider settings need confirmation before broader release.

Real product data is empty. Imported reference text is also empty; the supplied ratio PDF is documentation, not AI instructions. Future optional gender/reference-group selection and comparison bars are documented in future-ratio-references.md with source/sampling/measurement caveats and the Liu paper's published correction. Most requested profile, calibrated or cephalometric metrics are unavailable in this frontal-selfie phase.

Initial install failed ENOSPC with zero free C: space; space was subsequently restored and locked installation succeeded. The Sites npm wrapper has a Windows shim-path failure, so the starter's unchanged installer/framework entrypoints were invoked via absolute Node/npm. A Vite Windows EBUSY error on the copied PDF was resolved by excluding reference PDFs/runtime artifacts from HMR watch. These are documented execution adaptations, not reasons to claim unperformed validation.

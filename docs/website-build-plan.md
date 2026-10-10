# Facial proportions and skincare website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a phone-friendly website that measures facial proportions and uses the owner's OpenAI API key to provide cosmetic skin observations and relevant product recommendations.

**Architecture:** Use a React website with a server endpoint, client-side facial landmark detection, and deterministic geometry shared with the server. Keep the catalog, OpenAI adapter, and usage guard independent of the UI. Deploy a private preview through Sites; future native clients will reuse the analysis contract and will require a separate access design before mobile release.

**Tech Stack:** TypeScript, React, the Sites Vinext full-stack starter, MediaPipe Tasks Vision, Zod, Vitest, OpenAI Responses API with `gpt-4o-mini`, and Cloudflare D1 for minimal usage counters. Preserve the starter's supported versions; pin added dependency versions and lockfile during setup.

**Spec:** [Approved website design](website-design.md)

## Global Constraints

- Accept a JPEG, PNG, or WebP photo, up to 10 MB.
- The first version has no accounts, payments, or saved analysis history.
- Use GPT-4o mini initially, with the model configurable on the server.
- Store the owner's API key only as a server secret.
- Do not persist uploaded photos or questionnaire responses in application storage in the first version.
- Until the catalog is supplied, show clearly labeled general product categories; do not invent brands, prices, or purchase links.
- Treat image-based skin results as cosmetic observations rather than medical diagnoses.
- Without a configured key, show an explicit setup-required state.
- Any sample results must be labeled as demonstrations, never presented as analysis of an uploaded image.
- Private preview hosting may require ChatGPT sign-in through the host; this does not add app accounts. Do not widen access during the initial release.

## Execution prerequisites

The desktop currently reports no saved projects. Before implementation, establish a dedicated project checkout and project chat; the conversational coordinator retains this spec and plan and transfers them to the executor. Do not implement product code in the coordinator's document folder. If a saved project is still unavailable at execution time, request that the owner add a project rather than inventing a project ID.

Use the Sites skill for initialization, source synchronization, preview, packaging, and publication. Use its provided full-stack starter because server secrets and API calls are required. Before API-backed implementation, follow the OpenAI API-key workflow when available. The OpenAI Developers plugin is currently unavailable: the owner must enable it for the supported secret-configuration workflow. Continue independent UI and geometry work while that prerequisite is unresolved; live analysis and deployment with the owner's key remain unverified until configured.

Use one installer at a time. Read the preview reference appropriate to the host before starting a preview. Use the applicable frontend design skill for the UI and systematic debugging for observed failures. Commit completed tasks in the dedicated checkout; do not create unrelated commits in the coordinator's workspace.

## Review Focus

1. Phone photos with portrait dimensions or orientation metadata must produce the same geometry and overlay as their upright decoded pixels — Task 2.
2. Replacing a photo during processing must discard old results and release its object URL — Task 4.
3. An invented product ID, unsafe purchase URL, or incomplete model response must never become a displayed recommendation — Task 3.
4. Concurrent requests and service restarts must not bypass the configured aggregate analysis cap — Task 5.
5. Imported catalog text must remain untrusted data, and an unknown allergy match must not be advertised as safe — Task 3.

## File map and shared contract

Paths below are relative to the dedicated product checkout.

| Files | Responsibility |
| --- | --- |
| `app/page.tsx`, `app/layout.tsx`, `app/globals.css` | Entry, shared layout, responsive styling |
| `components/analysis-flow.tsx`, `photo-input.tsx`, `skin-questionnaire.tsx`, `analysis-results.tsx`, `landmark-overlay.tsx` | Upload-to-results flow and its accessible controls |
| `lib/contracts.ts`, `lib/image-validation.ts` | Shared types, runtime schemas, upload constraints |
| `lib/face/geometry.ts`, `landmarker.client.ts`, `landmarker.worker.ts` | Measurement calculation and browser detection |
| `public/models/`, `public/mediapipe/` | Version-pinned model and runtime assets |
| `lib/catalog.ts`, `data/products.json`, `data/reference.json` | Imported product and reference data |
| `lib/server/openai.ts`, `prompt.ts`, `usage.ts`, `environment.ts` | Server-only analysis, prompt, limits, and secrets |
| `app/api/analyze/route.ts`, `app/api/status/route.ts` | Analysis and secret-free readiness endpoints |
| `db/schema.ts`, `drizzle/` | Atomic usage counters and migrations |
| `tests/`, `docs/catalog-format.md`, `docs/api-contract.md`, `.env.example`, `README.md` | Verification and operating instructions |

`Point = { x: number; y: number; z: number }` uses normalized model coordinates. `FaceGeometry = { landmarks: Point[]; width: number; height: number; transform: number[] }` includes decoded pixel dimensions and the 4x4 transformation matrix.

`Ratio = { id: 'face_width_height' | 'inner_eye_gap_width' | 'mouth_width_face_width'; label: string; value: number; definition: string }` contains measured values, not AI guesses.

`Questionnaire = { concerns: string[]; sensitivity: 'yes' | 'no' | 'unknown'; allergies: string; currentProducts: string; budget: number | null; country: string }`. Limit arrays to 8 entries, free-text fields to 500 characters, and country to 80 characters. Budget must be finite and non-negative when provided.

`AnalyzeResult = { ratios: Ratio[]; ratioExplanations: { id: Ratio['id']; explanation: string }[]; observations: { feature: string; description: string; uncertainty: string }[]; recommendations: { kind: 'catalog' | 'category'; productId: string | null; category: string; reason: string; usage: string; cautions: string[] }[]; limitations: string[]; catalogMode: 'provided' | 'categories' }`.

`ApiError = { error: { code: string; message: string; retryable: boolean } }`. Map HTTP 400 to invalid input, 413 to oversized upload, 422 to unsuitable photo, 429 to usage limit, 503 to missing configuration, and 502 to an unsuccessful provider response. Expose no provider stack traces or credentials.

## Task 1: Validated upload and API contract

**Files:** Create `lib/contracts.ts`, `lib/image-validation.ts`, `tests/contracts.test.ts`, `tests/image-validation.test.ts`, `.env.example`, `docs/api-contract.md`; configure starter `package.json`, TypeScript, and Vitest.

**Interfaces:** Produce `validatePhoto(file: File): Promise<void>`, exported Zod schemas for `Questionnaire`, `FaceGeometry`, and `AnalyzeResult`, plus their inferred TypeScript types. Define `POST /api/analyze` as multipart form data with `image: File`, `questionnaire: JSON string`, `geometry: JSON string`, and `consent: 'true'`. Document this as a version-one contract; native access is a later task.

- [ ] Write failing tests: exactly `10 * 1024 * 1024` bytes is allowed; one additional byte is rejected; unsupported MIME and signature mismatch are rejected; empty files are rejected; invalid budget and excessively long fields fail schema validation; absent consent is invalid.
- [ ] Run `npm run test -- tests/contracts.test.ts tests/image-validation.test.ts`; confirm failures arise from the absent contract and validator.
- [ ] Initialize the supported Sites starter in the dedicated checkout and add the minimal test and runtime schema dependencies. Implement validation using actual file signatures for JPEG, PNG, and WebP in addition to MIME. Bound decoded dimensions to 4096 on either side as an implementation memory limit, with a useful resize message. Document key names only: `OPENAI_API_KEY`, `OPENAI_MODEL`, `DAILY_ANALYSIS_LIMIT`, `PER_VISITOR_HOURLY_LIMIT`, and `USAGE_HMAC_SECRET`.
- [ ] Run the two test files; all assertions must pass. Confirm `.env` files remain ignored and no key value appears in tracked files.
- [ ] Commit the validated contract and upload rules.

## Task 2: Real face landmarks and repeatable measurements

**Files:** Create `lib/face/geometry.ts`, `lib/face/landmarker.client.ts`, `lib/face/landmarker.worker.ts`, `components/landmark-overlay.tsx`, `tests/geometry.test.ts`, `tests/face-quality.test.ts`; add pinned runtime/model assets under `public/`.

**Interfaces:** Produce `computeRatios(face: FaceGeometry): Ratio[]`, `validateFaceQuality(face: FaceGeometry): void`, `detectFace(bitmap: ImageBitmap): Promise<FaceGeometry>`, and `LandmarkOverlay({ face, imageUrl })`.

- [ ] Write failing geometry tests using controlled landmark arrays: with width endpoints 400 pixels apart and height endpoints 600 pixels apart, `face_width_height` equals `2 / 3`; a 100-pixel inner eye gap gives `0.25`; a 200-pixel mouth span gives `0.5`. Repeat on different decoded aspect ratios, translated points, and proportional scale. Reject non-finite or out-of-range points and zero denominators.
- [ ] Write failing quality tests: zero detected faces and two detected faces are rejected; missing required points or matrix are rejected; rotations beyond the declared threshold return an unsuitable-photo error. Use synthetic rotation matrices to establish matrix convention before real-photo acceptance.
- [ ] Run `npm run test -- tests/geometry.test.ts tests/face-quality.test.ts`; verify the intended failures.
- [ ] Implement MediaPipe `FaceLandmarker` in `IMAGE` mode with `numFaces: 2`, detection/presence thresholds `0.7`, and transformation matrices enabled. Use a worker to keep the UI responsive. Decode the image upright once and use that same bitmap for detection, overlay, and submission preparation. Try GPU and then CPU initialization; propagate a meaningful failure if both fail.
- [ ] Calculate distances in pixel coordinates `(x * width, y * height)`. Candidate landmark pairs are cheek span `234–454`, upper mesh to chin `10–152`, inner eye corners `133–362`, and mouth corners `61–291`; verify labels against the actual model/overlay before retaining them. Call the height a face-mesh span, not a hairline measurement. Reject yaw/pitch above 15 degrees or roll above 10 degrees after verifying matrix convention. Label the thresholds as capture heuristics, not validated clinical accuracy.
- [ ] Run both test files; verify upright/rotated phone photos and landmark placement during available browser QA. Remove a candidate metric if its point mapping cannot be verified, and document that decision.
- [ ] Commit detection, measurement, and overlay implementation.

## Task 3: Catalog-constrained OpenAI analysis

**Files:** Create `lib/catalog.ts`, `data/products.json`, `data/reference.json`, `lib/server/openai.ts`, `lib/server/prompt.ts`, `lib/server/environment.ts`, `tests/catalog.test.ts`, `tests/openai.test.ts`, `docs/catalog-format.md`.

**Interfaces:** Produce `loadCatalog(): Product[]`, `eligibleProducts(products: Product[], answers: Questionnaire): Product[]`, and `analyzeWithOpenAI(input: { imageDataUrl: string; ratios: Ratio[]; answers: Questionnaire; products: Product[]; reference: string }, dependencies?: TestDependencies): Promise<Omit<AnalyzeResult, 'ratios'>>`. `Product` contains `id`, `name`, `category`, `ingredients: string[]`, `price: number | null`, `currency: string | null`, `countries: string[]`, `purchaseUrl: string | null`, and `usageNotes`.

- [ ] Write failing tests for missing/empty catalog category mode, case-insensitive known ingredient exclusion, country filtering, budget filtering only when price/currency context is usable, duplicate IDs, malformed catalog, and non-HTTPS purchase links. Unknown ingredient synonyms remain explicitly unresolved rather than being labeled safe.
- [ ] Write failing adapter tests using mocked HTTP responses: supported structured response parses; refusal, incomplete output, unknown ratio/product ID, changed measured numbers, or malformed fields are rejected; missing key gives setup-required; timeout gives a retryable error. Assert requests use `gpt-4o-mini` by default, `store: false`, and a bounded output limit. Include an imported product description containing instruction-like text and assert it is placed only in the data section, with the trusted task unchanged.
- [ ] Run `npm run test -- tests/catalog.test.ts tests/openai.test.ts`; confirm failures match missing behavior.
- [ ] Implement the Responses API request with text/image input and strict JSON schema output, `max_output_tokens: 1800`, an abort timeout of 45 seconds, and no automatic retry that could duplicate charges. Request only explanations and cosmetic observations; computed ratios are attached separately by the server. Validate schema and catalog membership again after parsing. Treat catalog/reference contents as data. Never send key values to the browser.
- [ ] Start with an empty real catalog and separately labeled example data in the catalog guide. Limit selected catalog records to 30 and reference text to 6000 characters. Render product names and links from the catalog lookup rather than model-provided strings. Show category guidance when no eligible real products exist, and disclose the absence of matches.
- [ ] Run both test files. When the supported key workflow becomes available, conduct one consented live request and record success or the actual limitation without saving the image.
- [ ] Commit the adapter and documented data import format.

## Task 4: Complete phone-friendly upload-to-results flow

**Files:** Create or update `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `components/analysis-flow.tsx`, `components/photo-input.tsx`, `components/skin-questionnaire.tsx`, `components/analysis-results.tsx`, `tests/analysis-flow.test.tsx`.

**Interfaces:** Consume Task 1 schemas, Task 2 detection/overlay, and `POST /api/analyze`. Produce one accessible flow with states `idle`, `photo-ready`, `detecting`, `submitting`, `complete`, and `error`.

- [ ] Write failing behavioral tests: submission requires photo and consent; repeated clicks send one request; replacing a photo increments a generation token and ignores the previous response; restarting clears answers/results and releases object URLs; server setup-required is displayed without fabricated results; catalog mode and estimated ratio labels are visible.
- [ ] Run `npm run test -- tests/analysis-flow.test.tsx`; confirm the missing flow fails these assertions.
- [ ] Implement a clean, calm visual design with one primary action per step, a visible photo preview, labeled questionnaire fields, and separate result sections. Explain photo instructions, provider processing, and the estimate/observation limits in concise copy. Add keyboard focus, screen-reader progress announcements, cancellation, and retry without losing the selected photo. Do not add a chat panel, accounts, or attractiveness scores.
- [ ] Implement JPEG submission preparation with maximum 1536-pixel long edge and quality `0.9`, preserving the original aspect ratio. Use the same orientation as detection; retain geometry dimensions for the original decoded bitmap. Show any sample results only behind an explicitly labeled demonstration action, if a demonstration is included.
- [ ] Run behavioral tests and check 375-, 768-, and 1440-pixel widths during available browser QA. Verify the face overlay aligns on phone portrait photos and the primary controls remain usable by keyboard.
- [ ] Commit the complete interface.

## Task 5: Protected endpoint and durable cost controls

**Files:** Create `app/api/analyze/route.ts`, `app/api/status/route.ts`, `lib/server/usage.ts`, `tests/analyze-route.test.ts`, `tests/usage.test.ts`; update `db/schema.ts`, migrations, `.openai/hosting.json`, and Worker environment types.

**Interfaces:** Produce `reserveAnalysis(visitorKey: string, now: Date): Promise<{ allowed: boolean; retryAfterSeconds: number }>` backed by atomic D1 operations; `POST(request: Request): Promise<Response>`; readiness `GET` returns `{ ready: boolean, model: string, catalogMode: 'provided' | 'categories' }` with no secret values.

- [ ] Write failing route tests asserting invalid input, missing consent, oversized upload, invalid geometry, or unavailable key causes zero provider calls; valid input recomputes ratios on the server; errors use the shared HTTP/error contract; a forged `Origin` is rejected for the web preview; output cannot expose secrets or raw provider errors.
- [ ] Write failing usage tests against a local database or verified atomic store: limit defaults are 20 global reservations per UTC day and 5 per visitor per hour; simultaneous reservations cannot exceed either cap; counters survive a new adapter instance; rejected reservations never call OpenAI. Count admitted attempts even when the provider fails to avoid retry abuse.
- [ ] Run `npm run test -- tests/analyze-route.test.ts tests/usage.test.ts`; verify the intended failures.
- [ ] Implement server validation and Task 2 geometry recomputation before cost reservation. Host the preview owner-private. Use the host's verified visitor identity, HMAC it with the server-only usage secret, and persist only hash/time/count usage records plus global aggregate counts. Delete expired visitor counters after 48 hours. Do not log photo content or answers. Keep global daily counters independent of visitor bucket identity and enforce both through one serialized/atomic reservation operation.
- [ ] Configure `DAILY_ANALYSIS_LIMIT` and `PER_VISITOR_HOURLY_LIMIT` from positive integer environment values; fail closed if required production binding or usage secret is unavailable. No R2/photo storage binding is needed. Apply migrations through the supported Sites workflow.
- [ ] Run both test files against real local persistence. Verify production access behavior separately from local mock sign-in. Document that public users and native clients need a subsequent authentication/access implementation; do not disable the private preview boundary for mobile convenience.
- [ ] Commit the endpoint and cost guard.

## Task 6: Verify, publish private preview, and prepare mobile handoff

**Files:** Update `README.md`, `docs/api-contract.md`, `docs/catalog-format.md`, `.env.example`; add `docs/verification.md` and `docs/mobile-roadmap.md`.

**Interfaces:** Deliver the deployed private preview URL, source checkout, import format, setup instructions, and a verification report. Future native apps consume the documented response model; they are not built in this website plan.

- [ ] Run `npm run test` and `npx tsc --noEmit`; resolve failures before publishing. Inspect the generated client assets to confirm no server secret value or server-only environment access is bundled.
- [ ] Use available browser QA for upload, questionnaire, landmark rendering, errors, keyless setup state, and the complete flow. Test a consented live image only after the owner's key is securely configured. Evaluate representative consented photos with varied appearances/lighting before calling the analysis validated; document unresolved quality limitations.
- [ ] Build/package and synchronize the exact source revision using the Sites helpers. Configure server secrets through the supported OpenAI Developers/Sites workflow. Publish owner-private through the native Sites deployment tools and wait for a terminal deployment result.
- [ ] Record tests, live request status, browser/device coverage, model configuration, remaining data gaps, and provider retention disclosures. Claim deployment only from the returned successful URL; claim real analysis only after a successful end-to-end live check. If key setup is blocked, deliver the verified local/keyless version and report the precise unresolved step instead of claiming a completed live app.
- [ ] Write the mobile roadmap: validate website; finalize reference/product data; design public/mobile access; choose native UI technology; implement photo selection and results on iOS/Android; test physical devices; prepare store releases. Reuse the server contract, avoid embedding the owner key in either app, and evaluate mobile landmark detection separately.
- [ ] Commit final documentation and present the preview plus any material limitations.

## Technical references checked for this plan

- [MediaPipe Face Landmarker for web](https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker/web_js)
- [OpenAI structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
- [OpenAI image input](https://developers.openai.com/api/docs/guides/images-vision)
- [OpenAI data controls](https://developers.openai.com/api/docs/guides/your-data)
- [GPT-4o mini](https://developers.openai.com/api/docs/models/gpt-4o-mini)

## Plan review and execution choice

Recommended: direct execution by one implementer in the dedicated project chat, followed by one independent final review. The tasks share contracts and one end-to-end user flow, so keeping implementation context together is economical. The alternative is separate implementation and review agents for each task, with higher coordination cost. The owner reviews this plan and chooses before implementation begins.

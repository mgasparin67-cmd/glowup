# Analysis API v1

POST `/api/analyze`: multipart `image` (JPEG/PNG/WebP, at most 10 MiB), `questionnaire` (JSON), `geometry` (JSON), `consent` (literal `true`). Fields follow `lib/contracts.ts`. Browser pixels are decoded upright once; geometry dimensions refer to that original bitmap. Submission is JPEG, max long edge 1536, quality .9. Geometry uses normalized landmarks and a column-major 4×4 model transform.

The server validates geometry and recomputes pixel-distance ratios. Browser geometry is an untrusted client measurement; the server does not independently verify that it matches the image. It is not clinical metrology. No physical distances, ideal ratios, or attractiveness scores.

An encoded-header scan is bounded to 1 MiB and enforces 32–4096 pixels on each side before browser bitmap decoding or server provider admission. It is not a complete server image decoder. Unusually large JPEG metadata headers are rejected with a re-export message. MediaPipe output is normalized to x/y/z because its extra visibility field is not part of this contract.

Response: `AnalyzeResult`, with computed ratios, explanatory text, cosmetic observations, recommendations, limitations, and catalog mode. Catalog names, ingredients, price, and URLs come from a separate validated catalog lookup. Model output cannot supply those details.

General categories are constrained to Gentle cleanser, Moisturizer and Sunscreen. The model can select catalog IDs/categories; recommendation reasons, usage and cautions use reviewed deterministic templates so unsupported safety claims cannot become recommendations. Unreviewed catalog `usageNotes` are not presented as usage instructions. Free-form cosmetic observations still require live evaluation; schema and language checks are not clinical validation.

Errors: `{error:{code,message,retryable}}`. HTTP 400 invalid input, 413 oversized image, 422 unsuitable face, 429 usage cap, 503 setup required, 502 provider failure. A 403 rejects missing host identity or an invalid Origin. Errors never contain provider bodies or credentials.

GET `/api/status`: `{ready,model,catalogMode}`. Readiness requires the key, D1, and HMAC secret. No secret values. Owner-private Sites access is preserved; native/public clients require a later access design.

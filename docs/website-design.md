# Facial proportions and skincare website — first version

## Intended outcome

Build a simple website where users upload an image of themselves and receive a facial proportions breakdown, visible skin observations, and skincare product recommendations. Use the owner's OpenAI API key with a low-cost image-capable model. The owner will supply analysis reference data and product data later. Start with a website that works on phones; iOS and Android apps follow after the web experience is validated.

## Proposed scope

The first version has no accounts, payments, or saved analysis history. These are proposed simplifications, not requirements stated by the owner. Users can upload a photo, complete a short questionnaire, run an analysis, view the results, and start again.

## User experience

1. Show brief instructions for a clear, front-facing photo in even lighting. Explain that the image is sent to OpenAI for analysis and ask the user to confirm consent before sending it.
2. Accept a JPEG, PNG, or WebP photo, up to 10 MB. Let the user preview and replace it.
3. Ask about self-reported skin concerns, sensitivity, known ingredient allergies, current products, budget, and shopping country. Allow unknown answers. These answers supplement the photo; the model must not guess allergies or sensitivity from appearance.
4. Show progress while analysis runs and clear retry messages if it fails.
5. Present three result sections: facial proportions, visible skin observations, and skincare recommendations with reasons.

## Facial proportions

A separate facial landmark component detects points and calculates supported ratios mathematically. Initial candidate measurements are face width relative to height, eye spacing relative to face width, and mouth width relative to face width. Only retain metrics whose landmark definitions and detection behavior are verified during implementation. Require one sufficiently visible face; ask for another photo when detection fails or pose makes measurements unsuitable.

Display the measurement definitions and a landmark overlay. Label values as estimates from this photo, affected by pose, expression, and camera perspective. Do not invent unavailable measurements, convert image distances into physical measurements without calibration, or introduce attractiveness scores and universal ideal ratios. OpenAI explains computed values rather than generating the numbers itself. The owner's later reference data can inform additional explanations and metrics after review.

## Skin observations and recommendations

Use GPT-4o mini initially, with the model configurable on the server. Provide the photo, questionnaire, computed measurements, and relevant reference/product records to the model. Request structured results with visible observations, limitations, recommendations, and reasons. Validate the returned structure before rendering it.

Treat image-based skin results as cosmetic observations rather than medical diagnoses. Let the model say that a concern cannot be assessed from the image. Do not promise that a product is safe or effective for a particular user based solely on the photograph.

When a product catalog is available, recommend only catalog entries and use their supplied names, ingredients, prices, and purchase links. Filter known ingredient conflicts before model selection. Until the catalog is supplied, show clearly labeled general product categories; do not invent brands, prices, or purchase links. Provide a simple documented catalog format for later data import.

## Application structure

- A responsive web interface owns photo selection, the questionnaire, the landmark overlay, and result presentation.
- A facial landmark component owns point detection and deterministic ratio calculations. Prefer browser-side execution if the chosen library meets compatibility and performance checks.
- A server analysis endpoint owns OpenAI requests, prompt assembly, catalog filtering, result validation, and error handling.
- A catalog adapter owns access to the owner's reference and product data, initially through a local structured file.

Keep the API response independent of the website UI so future iOS and Android clients can use the same analysis service. Choose the mobile implementation after validating the web flow; native store releases require their own builds, device testing, and release work.

## API key, privacy, and cost controls

Store the owner's API key only as a server secret. Never expose it in browser code, source control, logs, or result payloads. The user will configure it through the execution environment's secure secret mechanism, not by pasting it into this design document.

Do not persist uploaded photos or questionnaire responses in application storage in the first version. Avoid logging image content or personal answers. Explain OpenAI processing separately from application storage and confirm provider retention settings before publishing a privacy statement.

Validate upload type and size, limit request frequency, cap model output, and allow only one analysis request per active submission. Compress/resize images according to tested quality needs rather than always using the lowest detail setting. Record non-personal usage counts and token costs where available. Deploy a limited preview first and add a configurable application usage cap before wider access.

## Errors and verification

Verify invalid uploads, missing or multiple faces, unsupported pose, uncertain observations, absent catalog data, ingredient exclusions, malformed model results, API failures, repeated submissions, and usage caps. Test ratio calculations using known landmark coordinates. Check that the key is absent from browser assets and responses. Verify the mobile layout and the complete flow with real API access before claiming live analysis works.

Without a configured key, show an explicit setup-required state. Any sample results must be labeled as demonstrations, never presented as analysis of an uploaded image.

## Delivery stages

1. Review this design and create a concrete implementation plan.
2. Build and verify the responsive website with a small sample catalog and a documented import format.
3. Connect the owner's secure API key and supplied data; evaluate outputs on consented test photos across different appearances and lighting conditions.
4. Publish the validated website preview.
5. Build iOS and Android clients around the validated analysis service.

## Official model references

- GPT-4o mini supports text and image inputs and structured outputs: https://developers.openai.com/api/docs/models/gpt-4o-mini
- Image handling, limitations, and input cost rules: https://developers.openai.com/api/docs/guides/images-vision

Model availability, account access, and pricing must be checked again when connecting the live service.

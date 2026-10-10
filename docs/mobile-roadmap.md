# Mobile follow-up

1. Validate the website on consented photos across appearances, lighting, cameras, and upright/EXIF orientations. Confirm mesh mapping and pose heuristics empirically.
2. Finalize owner reference data and catalog ingredients, availability, and region/currency rules.
   The owner’s men/women ratio tables and source PDF are retained in `docs/future-ratio-references.md` and `docs/references/Looksmax.pdf`. Add an optional user-selected reference group and accessible comparison bars only after verifying matching measurement definitions. Use a read-only value marker/reference band (with numerical text), not a user-adjustable measurement or attractiveness score. Keep clinical norms, selected study samples and software conventions visibly distinct; unsupported profile/calibrated metrics remain unavailable. Do not infer gender or personality from facial appearance or proportions.
3. Design public/mobile authentication, consent, abuse protection, and data controls. Preserve the current owner-private host boundary until that work is approved.
4. Choose native UI technology after measuring the web flow. Evaluate native MediaPipe support independently; do not assume browser worker behavior transfers.
5. Implement photo selection, questionnaire, aligned geometry/overlay, progress, cancellation, results and retry for iOS and Android around API v1.
6. Test physical devices, accessibility, orientation, memory pressure, connection loss, and input quality. Never embed the owner’s key in a mobile client.
7. Prepare privacy disclosures and store releases as a separate phase.

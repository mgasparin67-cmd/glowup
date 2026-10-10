# glowup

Responsive private website for calculated facial ratios and cosmetic skincare observations. Source: this saved project. No app accounts, payments or history. No real product catalog is supplied; categories are clearly labeled.

## Run and verify

Node ≥22.13, Git, and npm are required. Use the Sites plugin helpers for install/build/source packaging/publication. The starter’s `sites()` and private auth integration are retained.

```text
npm run install:ci
node scripts/setup-face-assets.mjs
npm test
npm run typecheck
npm run db:generate
npm run build
npm run dev
```

Windows host fallback when npm is absent from PATH: run the system npm JavaScript entrypoint with Node, and place its directory on the process PATH. The Sites npm wrapper currently misresolves the system shim on this host; the starter entrypoint `node scripts/run-framework.mjs build` works. Dependency installation completed after disk space was restored. See `docs/verification.md`.

After generating migrations and building, apply each pending SQL file locally using the starter’s documented Wrangler D1 command; never replay an applied migration. Sites publication applies production migrations. D1 stores only HMAC visitor hashes, UTC time buckets, and usage reservations. Admitted attempts remain counted on provider failure; daily default 20, visitor hourly default 5. Expired visitor records are deleted after 48 hours on subsequent reservations. Usage protection fails closed if bindings or secrets are unavailable.

## Secure setup

Enable the **OpenAI Developers** plugin and use its `openai-platform-api-key` workflow, then configure the Site’s `OPENAI_API_KEY` through native runtime secrets. Do not paste secrets into chat or put them in source. Configure a securely generated `USAGE_HMAC_SECRET` (at least 32 characters) through the same native secret mechanism. Key names/default limits are in `.env.example`. `OPENAI_MODEL` defaults to `gpt-4o-mini`.

The readiness endpoint intentionally returns setup-required until key, HMAC secret, and D1 are present. A host-private preview may use ChatGPT sign-in; no separate app accounts are added. Keep the registered Site owner-private.

See [catalog import](docs/catalog-format.md), [API v1](docs/api-contract.md), [verification](docs/verification.md), and [mobile follow-up](docs/mobile-roadmap.md). Live analysis and publication require verified end-to-end checks; registration alone does not make a live site.

The owner’s future gender-selected comparison-bar requirements, ratio tables and research caveats are preserved in [future reference data](docs/future-ratio-references.md). The source PDF is retained under `docs/references`. No incompatible measurement has been substituted into those future reference ranges.

Optional progress cards: save dated numeric check-ins on this device, select two results and export a glowup comparison card. No photos or questionnaire answers are included in saved history. See docs/progress-sharing.md.

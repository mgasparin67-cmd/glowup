# Graph coverage and limitations

Detected 176 files. The graph describes extracted relationships, not a runtime or security audit.

## Code files with no extracted entities

- `.openai/hosting.json`
- `data/products.json`
- `data/reference.json`
- `drizzle/meta/0000_snapshot.json`
- `drizzle/meta/_journal.json`
- `public/models/assets.json`

## Other limits

- `.npmrc` was skipped as potentially sensitive.
- Git-ignored files and Graphify default noise directories were excluded. This includes the tracked Sites `build/` support directory, which Graphify treats as build output.
- CSS, font binaries, WASM and model binaries are not structurally parsed.
- Bundled MediaPipe JavaScript is included and dominates some high-degree nodes.
- Documentation can describe historical designs or pending features; check source and status before acting.
- Worker token usage was unavailable; no measured cost or savings is claimed.

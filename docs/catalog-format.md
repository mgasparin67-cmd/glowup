# Owner catalog import

Replace `data/products.json` with a JSON array of real, reviewed records. The current array is empty; the site explicitly shows product categories until eligible real records exist. Rebuild and publish the same Site after changes.

Example only — this is not a real product and must not be imported as a recommendation:

```json
[{"id":"your-stable-id","name":"Your actual supplied name","category":"Gentle cleanser","ingredients":["Exact INCI ingredient"],"price":null,"currency":null,"countries":["Canada"],"purchaseUrl":null,"usageNotes":"Supplied label instructions"}]
```

IDs must be unique, 1–80 ASCII letters/digits/underscore/hyphen. Names max 150 chars; ingredients max 100 entries of 100 chars each; countries max 80 entries. Price is nonnegative or null; currency is a three-letter uppercase code or null. Links must be HTTPS with no embedded credentials. `usageNotes` max 500 chars. Max 1000 records; the adapter selects at most 30 eligible entries. Invalid imports fail closed.

Use consistent country names. Known budget currencies: Canada CAD, US/USA/United States USD, UK/United Kingdom GBP, Australia AUD, New Zealand NZD. Budget filtering applies only with usable matching currency context. Empty countries means availability is unspecified. Unknown shopping country does not prove availability.

Known ingredient exclusion is exact and case-insensitive for comma/semicolon/newline separated allergy entries. Synonyms and natural-language descriptions remain unresolved; no recommendation is labeled allergy-safe. Review full INCI lists and regional availability before import. Do not include instructions intended to control the AI: imported content is untrusted data.

`data/reference.json` accepts `{ "text": "Owner-reviewed cosmetic reference data, up to 6000 characters" }`. Additional measurements require separate geometry verification; reference text cannot introduce invented measurements.

The adapter may use catalog `usageNotes` as untrusted context, but the UI does not render them as instructions. Recommendation usage/suitability uses deterministic cautions until a reviewed structured guidance system exists. Product IDs, names, prices, ingredients and HTTPS links still come directly from the validated catalog.

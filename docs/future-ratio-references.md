# Owner-supplied future comparison references

Received October 9, 2026. These values are preserved as supplied. They override the original design’s exclusion of reference comparisons for the future feature. The owner subsequently supplied `docs/references/Looksmax.pdf`; all ten pages were visually inspected. It is a research summary, with domain badges rather than recoverable hyperlinks; preserve its caveats and verify primary papers before treating every table entry as a norm. Never infer gender from a photo; users choose an optional reference group.

Future UI: a user-selected men/women reference group and a read-only comparison bar showing measured value, supplied target/range, and position within or outside it. Use a neutral label such as “comparison with your selected reference”; do not convert this into an attractiveness score. Show capture uncertainty and landmark definition beside each bar. Disable comparisons that do not have the same verified definition as the measurement. Unsupported measurements must remain unavailable.

| Metric | Men | Women |
| --- | --- | --- |
| Facial height ÷ bigonial width, described as golden ratio | About 1.57 (1.566 ± .085); phi is not a specific target | About 1.61 (1.613 ± .063), close to phi |
| Gonial angle | 121–126° | 125–129°, described as 3–5° wider |
| Facial thirds upper / middle / lower | 31 / 30.5 / 38.5% | 29.5 / 32.4 / 38.2% |
| Pupil distance ÷ face width | 46% | 46% |
| Total facial convexity, nose included | 138.6° ± 6.8° | 142° ± 6.1° |
| Facial convexity, nose excluded | 165–175°, norm near 169° | 165–175°, norm near 169° |
| Cheekbone position | Peak about 2 mm ahead of cornea; cheekbone width ÷ jaw width 1.13; FaceIQ height score 83–100% (non-academic) | Same landmarks, described as more prominent; width ÷ jaw width 1.17; FaceIQ height score 84–101% (non-academic) |
| Jaw frontal angle | 86.5–92.5° (FaceIQ, non-academic) | 87.5–93.5° (FaceIQ, non-academic) |
| Mandibular plane angle | SN-GoGn 32° (28–36°) or FMA 25° (20–30°) | Same norms; described as tending a few degrees steeper |
| Canthal tilt | About 6.5° in attractive faces; population average about 4° | About 8.5° in attractive faces; population average about 4° |
| Ramus ÷ mandible | .62; FaceIQ .6–.8 | .62; FaceIQ .6–.8 |
| FWHR | 1.8–1.95; average rather than true ideal | 1.7–1.9; small/inconsistent sex differences |
| Total FWHR | 1.3–1.4 (FaceIQ, non-academic) | No established range |
| Submental-cervical angle | 105–120° | 105–120° |
| Nasofrontal angle | 115–130°, toward acute end; Turkish sample about 124° | 115–130°, toward obtuse end; Turkish sample about 133° |
| Eye spacing | Inner corners 30–35 mm; pupils about 64 mm | Inner corners 30–35 mm; pupils about 62 mm |

## Measurement compatibility

Current website ratios are cheek span ÷ upper face-mesh-to-chin span, inner-eye-corner gap ÷ cheek span, and mouth-corner span ÷ cheek span. These are **not** facial height ÷ bigonial width, pupil separation ÷ face width, or a defined FWHR. Do not reuse their values to populate the new bars.

Physical millimetres require scale calibration; upper facial thirds need an actual hairline definition. Profile convexity, gonial, nasofrontal and neck angles need appropriate capture views and verified landmarks. Cephalometric planes such as SN-GoGn and FMA cannot be determined from this front-facing cosmetic selfie flow. FaceIQ-only definitions require their exact methodology before any comparable measurement.

Implement the comparison display only when source and measurement definitions are verified. This reference record is retained for the subsequent app phase; it is not included as AI instruction or represented as validated analysis in the current website.

## Source trace and evidence status

The PDF explicitly separates normal population measurements, selected aesthetic samples, and unvalidated software conventions. It warns that different landmark definitions are not interchangeable and that phone selfies do not support surgical/orthodontic measurement. Its recommendations are document content, not implementation instructions.

- [Liu, Salinas & Sharaf (2023)](https://pmc.ncbi.nlm.nih.gov/articles/PMC10335162/): primary study located. Sample: 21 male and 21 female Caucasian celebrities aged 23–42, selected using editorial/modeling/casting rankings. The 1.613/1.566 facial-height/bigonial-width finding and canthal-tilt contrasts belong to this selected sample, not universal targets.
- [Published correction (November 6, 2023)](https://academic.oup.com/asjopenforum/article/doi/10.1093/asjof/ojad097/7367857): the original Table 1 male interpupillary-distance value was corrected. Use the corrected version of record for any future import; do not silently substitute a population-average IPD from another source.
- Pallett, Link & Lee (2010), *New “Golden” Ratios for Facial Beauty*, DOI `10.1016/j.visres.2009.11.003`: source located. The 36%/46% result concerns manipulated female-face images and attractiveness comparisons. It does not establish a male target or a universal beauty threshold. Confirm the study’s face-width definition against any candidate mesh measurement.
- PDF references to Fernández-Riveiro (2003), Arnett (1999), Jensen & Palling (1954), Farkas norms, Powell & Humphreys, Ellenbogen & Karlin, Steiner/Tweed/Jarabak, and FaceIQ remain individually unverified. No values from these have been activated as website targets.

Reference import requirements: source URL/DOI, page/table, sample demographics and size, exact landmarks/formula, units, mean/SD versus desired range, capture modality, and status (`study`, `clinical_reference`, `software_convention`, or `unverified`). An SD is not automatically an ideal acceptance band. Avoid normalizing a user’s gender choice into a claim about biological sex or source-population match.


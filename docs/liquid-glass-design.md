# glowup liquid-glass direction

Approved by the owner's redesign request on October 11, 2026. Replaces the warm ivory/coral editorial direction.

- Faint, static baby-blue gradient canvas; dark navy text; accessible blue accents.
- Apple platform system typography, tighter large headings and comfortable body leading.
- Floating translucent navigation with blur, highlight edge and soft depth. Keep text-heavy content more opaque; avoid layered transparent panels.
- Rounded controls with immediate pressed feedback, visible keyboard focus and 44px navigation targets.
- Single-column phone layout. Header uses Overview and Membership to avoid wrapped navigation labels.
- Reduced-motion, reduced-transparency, increased-contrast and unsupported-blur fallbacks.
- Logo source: `docs/references/Glowup Liquid Glass Logo.pdf`. Primary logo and icon regions rendered directly from the supplied PDF into `public/glowup-liquid-logo.png` and `public/glowup-liquid-icon.png`; the faint backing color is preserved. Do not recreate the mark or restore the previous coral logo.
- Progress export uses the new logo and blue palette. No portrait or provider branding added.

The implementation is the web preview's CSS interpretation of Apple materials, not a native SwiftUI Liquid Glass implementation. Subscriber access and current prices are preserved. Native purchasing and billing-period usage metering remain separate pending work documented in `subscriptions.md`.

References: Apple Design skill and https://developer.apple.com/design/human-interface-guidelines/materials

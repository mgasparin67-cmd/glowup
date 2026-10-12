# iPhone subscriptions and launch pricing

Selected October 11, 2026. iPhone first, Apple in-app subscriptions; no Stripe checkout. Prices are proposed US storefront monthly tiers, not App Store products already created.

| Plan | USD/month | Scans per paid billing period | Input budget | Output budget |
|---|---:|---:|---:|---:|
| glowup Essential | $9.99 | 12 | 300,000 | 60,000 |
| glowup Plus | $39.99 | 120 | 3,000,000 | 600,000 |

Plus provides ten times the usage for about four times the price. Both plans offer the same analysis quality, questionnaire, ingredient guidance and optional local progress cards. The native app should show scans, remaining allowance and reset date; tokens are an internal cost control, not user-facing technical copy. Do not promise unlimited usage.

Planning ceiling per scan: 25,000 total billed input tokens (including image input, system instructions and context), 5,000 output tokens (including reasoning). At GPT-5 mini's published $0.25 per million input and $2 per million output, full budgets cost $0.195 and $1.95. No caching or batch discounts are assumed. These estimates are not measured scans, profit forecasts or guaranteed bills. Image sizes, reasoning, failures and retries need live verification. Current runtime still uses its existing configured model; no model migration has been performed.

Using a conservative 30% App Store commission assumption leaves $6.993/$27.993 before model expenses, taxes, hosting, support, refunds and acquisition. Apple's Small Business Program can provide a 15% commission for eligible enrolled developers. Do not assume enrollment. GPT-5 mini is marked deprecated in current official docs; confirm availability and a supported model before launch, then recheck economics without silently substituting a model.

## Implemented

- Public product/ingredient recommendations removed. The public page describes the paid workflow.
- Locked membership preview shows both prices and scan allowances. Purchasing is disabled and clearly unavailable.
- Server-rendered home shows the questionnaire/photo/results only for active stored Apple access.
- The analysis API checks subscriber access before reading the photo, reserving usage or calling the analysis provider. Browser claims cannot grant access.
- Expired, revoked, missing and unavailable subscription records fail closed.
- Public concern labels no longer import the ingredient/product guide into the questionnaire client bundle.
- A local migration describes minimal subscription records. It has not been applied to a hosted database. There is no client-accessible entitlement write endpoint.

## Required before accepting payment

1. Build the native iPhone app on a Mac with Xcode and connect account authentication to a production API. Existing authentication relies on the private preview host's trusted headers; those headers are not a general-purpose native login system. Keep the origin behind the trusted host until native authentication is implemented.
2. Create Essential and Plus auto-renewable products in one subscription group in App Store Connect. Use verified product IDs and localized StoreKit prices; price text in this preview is not a store configuration.
3. Implement StoreKit purchase, pending/cancelled states, restore purchases and manage subscriptions. Keep Terms and Privacy accessible before purchase. Access unlocks only after server verification, not a success screen.
4. Verify Apple-signed transactions on the server, including certificate chain, bundle/app/environment, allowed product, expiry, revocation and authenticated account binding. Enforce unique original transaction ownership. Use App Store Server Notifications V2 plus reconciliation for renewal, expiration and refunds. No verification adapter currently writes the access table.
5. Atomically reserve per-plan scan/input/output budgets before provider calls; account for actual reported usage, including reasoning. A failed attempt consumes its internal cost reserve but does not count as a completed customer scan. Bound retries. Reset on verified paid billing-period boundaries, not calendar months; switching plans must not create extra resets. Quotas are defined in configuration but this monthly meter is not implemented yet. Existing global/hourly protection remains.
6. Paid scans must also wait for analysis API setup and validated product formulas. Do not charge for a feature that is unavailable.
7. Test purchases and restore on Apple sandbox/TestFlight: renewal, upgrade, downgrade, refund, billing retry, expiry, repeated events and another-account restoration. Test real image/model usage before publishing or changing caps.

Billing identifiers, entitlement status and numeric usage counters require storage. Privacy copy must distinguish that from photos/questionnaire answers, which are not retained. Optional numeric progress remains local to the device.

## Sources

- https://developers.openai.com/api/docs/models/gpt-5-mini
- https://developer.apple.com/app-store/small-business-program/
- https://developer.apple.com/documentation/appstoreserverapi
- https://developer.apple.com/documentation/StoreKit/handling-subscriptions-billing

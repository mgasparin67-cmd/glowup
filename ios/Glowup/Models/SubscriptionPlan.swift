import Foundation

/// Proposed launch tiers from `lib/subscription-plans.ts` and `docs/subscriptions.md`.
/// At checkout, StoreKit's localized `displayPrice` replaces `monthlyUSD`.
struct SubscriptionPlan: Identifiable {
    let id: String
    let name: String
    let monthlyUSD: Decimal
    let scansPerMonth: Int
    let summary: String

    static let all = [
        SubscriptionPlan(id: "essential", name: "glowup Essential", monthlyUSD: 9.99, scansPerMonth: 12,
                         summary: "For regular skincare check-ins."),
        SubscriptionPlan(id: "plus", name: "glowup Plus", monthlyUSD: 39.99, scansPerMonth: 120,
                         summary: "Ten times the scan allowance for frequent use."),
    ]

    static let includedFeatures = [
        "A questionnaire built around your skin concerns",
        "Facial scan and visible skin observations",
        "Personalized skincare recommendations with reasons",
        "Optional progress check-ins and shareable cards",
    ]
}

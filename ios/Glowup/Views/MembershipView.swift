import SwiftUI

/// Locked membership preview, matching the web paywall. Purchasing waits for StoreKit
/// products in App Store Connect and server-side transaction verification.
struct MembershipView: View {
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    Text("Your skin.\n\(Text("Your starting point.").foregroundStyle(Theme.accent))")
                        .font(.largeTitle.bold())

                    Text("Personalized skincare recommendations are included with a glowup subscription.")

                    Card {
                        ForEach(SubscriptionPlan.includedFeatures, id: \.self) { feature in
                            Label(feature, systemImage: "checkmark")
                                .labelStyle(FeatureLabelStyle())
                        }
                    }

                    ForEach(SubscriptionPlan.all) { plan in
                        Card {
                            Text(plan.name).font(.headline)
                            HStack(alignment: .firstTextBaseline, spacing: 6) {
                                Text(plan.monthlyUSD, format: .currency(code: "USD"))
                                    .font(.title.bold())
                                Text("USD / month").foregroundStyle(Theme.muted)
                            }
                            Text("\(plan.scansPerMonth) scans per month").font(.subheadline.weight(.semibold))
                            Text(plan.summary).font(.footnote).foregroundStyle(Theme.muted)
                            Button("Choose \(plan.id == "essential" ? "Essential" : "Plus")") {}
                                .buttonStyle(.glassProminent)
                                .disabled(true)
                        }
                    }

                    Text("Subscriptions are being prepared. Before you buy, the app will show the App Store price and renewal terms.")
                        .font(.footnote)
                        .foregroundStyle(Theme.muted)
                    Text("A scan provides cosmetic observations, not a medical diagnosis. Product suitability cannot be confirmed from a photo.")
                        .font(.footnote)
                        .foregroundStyle(Theme.muted)
                }
                .padding(20)
            }
            .navigationTitle("Membership")
            .navigationBarTitleDisplayMode(.inline)
            .glowupBackground()
        }
    }
}

private struct FeatureLabelStyle: LabelStyle {
    func makeBody(configuration: Configuration) -> some View {
        HStack(alignment: .firstTextBaseline, spacing: 10) {
            configuration.icon.foregroundStyle(Theme.accent).font(.subheadline.bold())
            configuration.title
        }
    }
}

#Preview {
    MembershipView()
}

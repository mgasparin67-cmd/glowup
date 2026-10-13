import SwiftUI

struct HomeView: View {
    var startScan: () -> Void
    var showMembership: () -> Void

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 28) {
                    Image(.logo)
                        .resizable()
                        .scaledToFit()
                        .frame(maxWidth: 220)
                        .clipShape(.rect(cornerRadius: 14))
                        .accessibilityLabel("glowup")

                    VStack(alignment: .leading, spacing: 12) {
                        Text("Understand your face.\n\(Text("Care for your skin.").foregroundStyle(Theme.accent))")
                            .font(.largeTitle.bold())
                            .tracking(-0.5)
                        Text("Explore your facial proportions and visible skin details. Find a thoughtful starting point for your skincare.")
                            .font(.body)
                            .foregroundStyle(Theme.muted)
                    }

                    HStack(spacing: 12) {
                        Button("Start a scan", systemImage: "arrow.right", action: startScan)
                            .buttonStyle(.glassProminent)
                            .controlSize(.large)
                        Button("Membership", action: showMembership)
                            .buttonStyle(.glass)
                            .controlSize(.large)
                    }

                    Card {
                        Text("Skincare chosen around you.")
                            .font(.title2.bold())
                        Text("A glowup subscription unlocks skincare recommendations shaped by your answers and a facial scan.")
                        Text("Tell us about your skin concerns, sensitivity and current routine. Add a clear photo, then explore suggestions tailored to your reported concerns and visible observations.")
                            .font(.subheadline)
                            .foregroundStyle(Theme.muted)
                    }

                    Text("A facial scan cannot diagnose skin conditions or confirm product suitability. Persistent, painful or changing symptoms need a qualified professional.")
                        .font(.footnote)
                        .foregroundStyle(Theme.muted)
                }
                .padding(20)
            }
            .glowupBackground()
        }
    }
}

#Preview {
    HomeView(startScan: {}, showMembership: {})
}

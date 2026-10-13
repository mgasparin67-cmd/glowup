import SwiftUI

@main
struct GlowupApp: App {
    var body: some Scene {
        WindowGroup {
            RootView()
        }
    }
}

struct RootView: View {
    enum Section: Hashable { case overview, scan, progress, membership }

    @State private var selection = Section.overview

    var body: some View {
        TabView(selection: $selection) {
            Tab("Overview", systemImage: "sparkles", value: .overview) {
                HomeView(startScan: { selection = .scan }, showMembership: { selection = .membership })
            }
            Tab("Scan", systemImage: "faceid", value: .scan) {
                ScanFlowView()
            }
            Tab("Progress", systemImage: "chart.line.uptrend.xyaxis", value: .progress) {
                ProgressScreen()
            }
            Tab("Membership", systemImage: "lock", value: .membership) {
                MembershipView()
            }
        }
        .tint(Theme.accent)
    }
}

#Preview {
    RootView()
}

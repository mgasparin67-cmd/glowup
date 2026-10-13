import SwiftUI

/// Optional dated check-ins, stored only on this iPhone.
struct ProgressScreen: View {
    @State private var checkIns: [CheckIn] = []
    @State private var loadFailed = false
    @State private var confirmClear = false

    private let history = ProgressHistory()

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    Text("Compare dated results and share a glowup progress card. Check-ins stay on this iPhone and never include photos or answers.")
                        .foregroundStyle(Theme.muted)

                    if loadFailed {
                        Card {
                            Label("Saved check-ins could not be read.", systemImage: "exclamationmark.triangle")
                        }
                    } else if checkIns.isEmpty {
                        Card {
                            Label("No check-ins yet", systemImage: "chart.line.uptrend.xyaxis")
                                .font(.headline)
                            Text("After a scan, save its proportions here to compare them over time.")
                                .font(.subheadline)
                                .foregroundStyle(Theme.muted)
                        }
                    } else {
                        ForEach(checkIns.reversed()) { checkIn in
                            Card {
                                Text(checkIn.date, format: .dateTime.year().month(.abbreviated).day())
                                    .font(.headline)
                                ForEach(checkIn.measurements, id: \.id) { measurement in
                                    LabeledContent(measurement.id.label) {
                                        Text(measurement.value, format: .number.precision(.fractionLength(3)))
                                            .monospacedDigit()
                                    }
                                    .font(.subheadline)
                                }
                            }
                        }
                        Button("Clear saved check-ins", role: .destructive) { confirmClear = true }
                            .buttonStyle(.glass)
                    }
                }
                .padding(20)
            }
            .navigationTitle("Progress")
            .glowupBackground()
            .onAppear(perform: load)
            .confirmationDialog("Clear all saved check-ins on this iPhone?", isPresented: $confirmClear, titleVisibility: .visible) {
                Button("Clear check-ins", role: .destructive) {
                    history.clear()
                    load()
                }
            }
        }
    }

    private func load() {
        do {
            checkIns = try history.checkIns()
            loadFailed = false
        } catch {
            loadFailed = true
        }
    }
}

#Preview {
    ProgressScreen()
}

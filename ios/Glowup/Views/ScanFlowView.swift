import PhotosUI
import SwiftUI

struct ScanFlowView: View {
    enum PhotoState {
        case empty
        case checking
        case passed(FaceCheck.Passed)
        case failed(FaceCheckFailure)
    }

    @State private var answers = Questionnaire()
    @State private var photoState = PhotoState.empty
    @State private var pickerItem: PhotosPickerItem?
    @State private var showCamera = false
    @State private var consent = false
    @State private var checkTask: Task<Void, Never>?
    @State private var savedCheckIn = false
    @State private var saveError: String?

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    QuestionnaireForm(answers: $answers)
                    photoCard
                    if case .passed(let result) = photoState {
                        proportionsCard(result)
                    }
                    analyzeCard
                    Button("Start again", systemImage: "arrow.counterclockwise", action: restart)
                        .buttonStyle(.glass)
                }
                .padding(20)
            }
            .scrollDismissesKeyboard(.interactively)
            .navigationTitle("Scan")
            .navigationBarTitleDisplayMode(.inline)
            .glowupBackground()
            .onChange(of: pickerItem) { _, item in
                guard let item else { return }
                check { try? await item.loadTransferable(type: Data.self) }
            }
            .fullScreenCover(isPresented: $showCamera) {
                CameraPicker { image in
                    check { image.jpegData(compressionQuality: 0.9) }
                }
                .ignoresSafeArea()
            }
        }
    }

    private var photoCard: some View {
        Card {
            StepHeading(number: 2, title: "Add a clear photo")

            switch photoState {
            case .empty:
                Text("Choose a front-facing photo with your whole face visible.")
                    .foregroundStyle(Theme.muted)
            case .checking:
                HStack(spacing: 10) {
                    ProgressView()
                    Text("Checking your photo on this iPhone…")
                }
            case .passed(let result):
                LandmarkOverlay(result: result)
                Label("Face found. Pose looks level.", systemImage: "checkmark.circle.fill")
                    .foregroundStyle(Theme.accent)
                    .font(.subheadline.weight(.semibold))
            case .failed(let failure):
                Label(failure.message, systemImage: "exclamationmark.triangle")
                    .font(.subheadline)
                    .padding(12)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Theme.wash, in: .rect(cornerRadius: 10))
            }

            HStack(spacing: 12) {
                let pickerTitle = hasPhoto ? "Replace photo" : "Choose photo"
                PhotosPicker(selection: $pickerItem, matching: .images) {
                    Label(pickerTitle, systemImage: "photo")
                }
                .buttonStyle(.glass)
                if CameraPicker.isAvailable {
                    Button("Take photo", systemImage: "camera") { showCamera = true }
                        .buttonStyle(.glass)
                }
            }
            .disabled(isChecking)

            VStack(alignment: .leading, spacing: 6) {
                Text("A few things make a difference").font(.subheadline.weight(.semibold))
                Text("• Keep your head level and expression relaxed.\n• Include your full face, without filters or heavy shadows.\n• Remove glasses or anything covering your features.")
                    .font(.subheadline)
                    .foregroundStyle(Theme.muted)
            }
            .padding(.top, 4)

            Label("Your face is checked on this iPhone. Nothing is sent anywhere at this step.", systemImage: "lock.shield")
                .font(.footnote)
                .foregroundStyle(Theme.muted)
        }
    }

    private func proportionsCard(_ result: FaceCheck.Passed) -> some View {
        Card {
            StepHeading(number: 3, title: "Facial proportions")
            ForEach(result.ratios) { ratio in
                VStack(alignment: .leading, spacing: 4) {
                    Text(ratio.label).font(.subheadline.weight(.semibold))
                    HStack(alignment: .firstTextBaseline, spacing: 6) {
                        Text(ratio.value, format: .number.precision(.fractionLength(3)))
                            .font(.title.bold().monospacedDigit())
                        Text("ratio").font(.footnote).foregroundStyle(Theme.muted)
                    }
                    Text("Estimate from this photo").font(.caption).foregroundStyle(Theme.accent)
                    DisclosureGroup("How it’s measured") {
                        Text(ratio.definition)
                            .font(.footnote)
                            .foregroundStyle(Theme.muted)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding(.top, 4)
                    }
                    .font(.footnote)
                }
                .padding(.vertical, 6)
                Divider()
            }
            Text("Distances are calculated from landmarks in decoded pixel coordinates. Pose, expression, lighting and camera perspective limit their accuracy. Capture thresholds are heuristics, not clinical validation.")
                .font(.footnote)
                .foregroundStyle(Theme.muted)

            if savedCheckIn {
                Label("Saved to Progress on this iPhone.", systemImage: "checkmark.circle.fill")
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(Theme.accent)
            } else {
                Button("Save to progress", systemImage: "plus.circle") { save(result) }
                    .buttonStyle(.glass)
                Text("Saves only these three numbers and today’s date, on this iPhone. No photo is saved.")
                    .font(.caption)
                    .foregroundStyle(Theme.muted)
            }
            if let saveError {
                Text(saveError).font(.footnote)
            }
        }
    }

    private var analyzeCard: some View {
        Card {
            StepHeading(number: 4, title: "Analyze")
            Toggle(isOn: $consent) {
                Text("I consent to sending my photo, answers and calculated proportions to our analysis provider for cosmetic analysis.")
                    .font(.subheadline)
            }
            .tint(Theme.accent)
            Text("glowup does not store your photos or questionnaire answers. Progress check-ins stay on this device only when you choose to save them.")
                .font(.footnote)
                .foregroundStyle(Theme.muted)
            Button("Analyze my photo", systemImage: "arrow.right") {}
                .buttonStyle(.glassProminent)
                .controlSize(.large)
                .disabled(true)
            Text("Analysis isn’t available in the iPhone app yet. It needs sign-in, a membership and the analysis service to be connected.")
                .font(.footnote)
                .foregroundStyle(Theme.muted)
        }
    }

    private var hasPhoto: Bool {
        if case .empty = photoState { false } else { true }
    }

    private var isChecking: Bool {
        if case .checking = photoState { true } else { false }
    }

    /// Runs one face check at a time; a newer photo cancels the older check.
    private func check(_ load: @escaping () async -> Data?) {
        checkTask?.cancel()
        photoState = .checking
        savedCheckIn = false
        saveError = nil
        checkTask = Task {
            guard let data = await load() else {
                if !Task.isCancelled { photoState = .failed(.unreadable) }
                return
            }
            let outcome: PhotoState
            do throws(FaceCheckFailure) {
                outcome = .passed(try await FaceCheck().run(on: data))
            } catch {
                outcome = .failed(error)
            }
            if !Task.isCancelled { photoState = outcome }
        }
    }

    private func save(_ result: FaceCheck.Passed) {
        let checkIn = CheckIn(id: UUID().uuidString, date: .now,
                              measurements: result.ratios.map { RatioValue(id: $0.id, value: $0.value) })
        do {
            try ProgressHistory().save(checkIn)
            savedCheckIn = true
            saveError = nil
        } catch {
            saveError = "This check-in couldn’t be saved."
        }
    }

    private func restart() {
        checkTask?.cancel()
        answers = Questionnaire()
        photoState = .empty
        pickerItem = nil
        consent = false
        savedCheckIn = false
        saveError = nil
    }
}

/// The checked photo with MediaPipe's face mesh points drawn over it.
private struct LandmarkOverlay: View {
    let result: FaceCheck.Passed

    var body: some View {
        Image(uiImage: result.image)
            .resizable()
            .scaledToFit()
            .overlay {
                Canvas { context, size in
                    for point in result.geometry.landmarks {
                        let center = CGPoint(x: point.x * size.width, y: point.y * size.height)
                        context.fill(Path(ellipseIn: CGRect(x: center.x - 1, y: center.y - 1, width: 2, height: 2)),
                                     with: .color(.white.opacity(0.85)))
                    }
                }
                .allowsHitTesting(false)
            }
            .clipShape(.rect(cornerRadius: 12))
            .frame(maxHeight: 360)
            .accessibilityLabel("Your photo with the detected face mesh")
    }
}

#Preview {
    ScanFlowView()
}

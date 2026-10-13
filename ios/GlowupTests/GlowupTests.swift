import Foundation
import Testing
@testable import Glowup

struct QuestionnaireTests {
    @Test func `toggling a concern adds then removes it`() {
        var answers = Questionnaire()
        answers.toggle("Dryness")
        #expect(answers.concerns == ["Dryness"])
        answers.toggle("Dryness")
        #expect(answers.concerns.isEmpty)
    }

    @Test func `encodes with the API v1 field names and values`() throws {
        var answers = Questionnaire()
        answers.sensitivity = .yes
        answers.budget = 25
        let json = try #require(try JSONSerialization.jsonObject(with: JSONEncoder().encode(answers)) as? [String: Any])
        #expect(Set(json.keys) == ["concerns", "sensitivity", "allergies", "currentProducts", "budget", "country"])
        #expect(json["sensitivity"] as? String == "yes")
    }

    @Test func `rejects a negative budget`() {
        var answers = Questionnaire()
        answers.budget = -1
        #expect(!answers.isValid)
    }
}

struct FaceGeometryTests {
    /// A level face: cheeks 0.2–0.8, mesh 0.2–0.9, eyes 0.45–0.55, mouth 0.4–0.6 across a 1000×1000 photo.
    private func geometry(transform: [Double] = rotation(yaw: 0), width: Int = 1000, height: Int = 1000) -> FaceGeometry {
        var points = Array(repeating: FaceGeometry.Point(x: 0.5, y: 0.5, z: 0), count: FaceGeometry.landmarkCount)
        points[234].x = 0.2; points[454].x = 0.8
        points[10].y = 0.2; points[152].y = 0.9
        points[133].x = 0.45; points[362].x = 0.55
        points[61].x = 0.4; points[291].x = 0.6
        return FaceGeometry(landmarks: points, width: width, height: height, transform: transform)
    }

    /// Column-major R = Rz(roll) Ry(yaw) Rx(pitch), angles in degrees.
    private static func rotation(yaw: Double = 0, pitch: Double = 0, roll: Double = 0) -> [Double] {
        let (y, p, r) = (yaw * .pi / 180, pitch * .pi / 180, roll * .pi / 180)
        let rz = [[cos(r), -sin(r), 0], [sin(r), cos(r), 0], [0, 0, 1.0]]
        let ry = [[cos(y), 0, sin(y)], [0, 1, 0], [-sin(y), 0, cos(y)]]
        let rx = [[1, 0, 0], [0, cos(p), -sin(p)], [0, sin(p), cos(p)]]
        func multiply(_ a: [[Double]], _ b: [[Double]]) -> [[Double]] {
            (0..<3).map { i in (0..<3).map { j in (0..<3).reduce(0) { $0 + a[i][$1] * b[$1][j] } } }
        }
        let m = multiply(multiply(rz, ry), rx)
        var transform = [Double](repeating: 0, count: 16)
        for column in 0..<3 {
            for row in 0..<3 { transform[column * 4 + row] = m[row][column] }
        }
        transform[15] = 1
        return transform
    }

    @Test func `ratios match the web definitions`() throws {
        let ratios = try geometry().ratios()
        #expect(ratios.map(\.id) == [.faceWidthHeight, .innerEyeGapWidth, .mouthWidthFaceWidth])
        #expect(abs(ratios[0].value - 600.0 / 700.0) < 1e-9)
        #expect(abs(ratios[1].value - 100.0 / 600.0) < 1e-9)
        #expect(abs(ratios[2].value - 200.0 / 600.0) < 1e-9)
    }

    @Test func `uses pixel distances for non-square photos`() throws {
        let ratios = try geometry(width: 800, height: 1200).ratios()
        #expect(abs(ratios[0].value - (0.6 * 800) / (0.7 * 1200)) < 1e-9)
    }

    @Test(arguments: [
        (0.0, 0.0, 0.0, true),
        (14.0, -14.0, 9.0, true),
        (16.0, 0.0, 0.0, false),
        (0.0, 16.0, 0.0, false),
        (0.0, 0.0, -11.0, false),
    ])
    func `pose limits match the web app`(yaw: Double, pitch: Double, roll: Double, accepted: Bool) {
        let face = geometry(transform: Self.rotation(yaw: yaw, pitch: pitch, roll: roll))
        if accepted {
            #expect(throws: Never.self) { try face.validate() }
        } else {
            #expect(throws: FaceCheckFailure.notFacingCamera) { try face.validate() }
        }
    }

    @Test func `rejects an incomplete mesh`() {
        let face = FaceGeometry(landmarks: [], width: 1000, height: 1000, transform: Self.rotation())
        #expect(throws: FaceCheckFailure.incompleteMesh) { try face.validate() }
    }

    @Test func `rejects a skewed transform`() {
        var transform = Self.rotation()
        transform[4] = 0.5 // second column no longer orthogonal to the first
        #expect(throws: FaceCheckFailure.poseUnreliable) { try geometry(transform: transform).validate() }
    }

    /// End-to-end MediaPipe check on a real photo. Photos are not committed; pass one with
    /// `TEST_RUNNER_GLOWUP_FACE_PHOTO=/path/to/photo.jpg xcodebuild … test`.
    @Test(.enabled(if: ProcessInfo.processInfo.environment["GLOWUP_FACE_PHOTO"] != nil))
    func `MediaPipe measures a real photo`() async throws {
        let path = try #require(ProcessInfo.processInfo.environment["GLOWUP_FACE_PHOTO"])
        let result = try await FaceCheck().run(on: Data(contentsOf: URL(filePath: path)))
        #expect(result.geometry.landmarks.count == FaceGeometry.landmarkCount)
        #expect(result.ratios.count == 3)
        #expect(result.ratios.allSatisfy { $0.value.isFinite && $0.value > 0 })
        for ratio in result.ratios {
            print("GLOWUP_RATIO \(ratio.id.rawValue)=\(ratio.value.formatted(.number.precision(.fractionLength(4))))")
        }
    }

    @Test func `unreadable data fails cleanly`() async {
        await #expect(throws: FaceCheckFailure.unreadable) {
            try await FaceCheck().run(on: Data("not an image".utf8))
        }
    }
}

struct ProgressHistoryTests {
    let history: ProgressHistory

    init() {
        let suite = "glowup.tests.\(UUID().uuidString)"
        history = ProgressHistory(defaults: UserDefaults(suiteName: suite)!)
    }

    private func checkIn(_ id: String, daysAgo: Double, value: Double = 0.8) -> CheckIn {
        CheckIn(id: id, date: Date(timeIntervalSinceNow: -daysAgo * 86_400),
                measurements: MeasurementID.allCases.map { RatioValue(id: $0, value: value) })
    }

    @Test func `saves in date order and replaces by id`() throws {
        try history.save(checkIn("b", daysAgo: 1))
        try history.save(checkIn("a", daysAgo: 5))
        try history.save(checkIn("b", daysAgo: 1, value: 0.9))
        let saved = try history.checkIns()
        #expect(saved.map(\.id) == ["a", "b"])
        #expect(saved.last?.measurements.first?.value == 0.9)
    }

    @Test func `keeps only the newest 30`() throws {
        for day in 0..<35 { try history.save(checkIn("c\(day)", daysAgo: Double(day))) }
        let saved = try history.checkIns()
        #expect(saved.count == 30)
        #expect(!saved.contains { $0.id == "c34" })
    }

    @Test func `rejects a check-in with a missing measurement`() {
        let bad = CheckIn(id: "x", date: .now, measurements: [RatioValue(id: .faceWidthHeight, value: 1)])
        #expect(throws: ProgressError.invalidCheckIn) { try history.save(bad) }
    }

    @Test func `compares earlier to later`() throws {
        let rows = try ProgressHistory.compare(checkIn("a", daysAgo: 3, value: 0.8), checkIn("b", daysAgo: 1, value: 0.85),
                                               ids: [.faceWidthHeight, .faceWidthHeight])
        #expect(rows.count == 1)
        #expect(abs(rows[0].change - 0.05) < 1e-9)
        #expect(throws: ProgressError.wrongOrder) {
            try ProgressHistory.compare(checkIn("b", daysAgo: 1), checkIn("a", daysAgo: 3), ids: [.faceWidthHeight])
        }
    }

    @Test func `clear removes everything`() throws {
        try history.save(checkIn("a", daysAgo: 1))
        history.clear()
        #expect(try history.checkIns().isEmpty)
    }
}

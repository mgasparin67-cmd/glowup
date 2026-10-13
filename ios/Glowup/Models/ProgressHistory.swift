import Foundation

/// Port of `lib/progress.ts`: optional numeric check-ins kept only on this device.
nonisolated enum MeasurementID: String, Codable, CaseIterable {
    case faceWidthHeight = "face_width_height"
    case innerEyeGapWidth = "inner_eye_gap_width"
    case mouthWidthFaceWidth = "mouth_width_face_width"

    var label: String {
        switch self {
        case .faceWidthHeight: "Face width / mesh height"
        case .innerEyeGapWidth: "Inner eye gap / face width"
        case .mouthWidthFaceWidth: "Mouth width / face width"
        }
    }
}

struct RatioValue: Codable, Equatable {
    let id: MeasurementID
    let value: Double
}

struct CheckIn: Codable, Equatable, Identifiable {
    let id: String
    let date: Date
    var definitionVersion = 1
    let measurements: [RatioValue]

    /// Exactly one positive, finite value for each measurement, like the web schema.
    var isValid: Bool {
        definitionVersion == 1
            && !id.isEmpty && id.count <= 80
            && measurements.count == MeasurementID.allCases.count
            && Set(measurements.map(\.id)).count == MeasurementID.allCases.count
            && measurements.allSatisfy { $0.value.isFinite && $0.value > 0 }
    }
}

struct ComparisonRow: Equatable {
    let id: MeasurementID
    let before: Double
    let after: Double
    var change: Double { after - before }
}

enum ProgressError: Error, Equatable {
    case invalidCheckIn
    case unreadableHistory
    case wrongOrder
}

/// Stores up to 30 check-ins, oldest first, under the same key name as the web app.
struct ProgressHistory {
    static let key = "glowup.progress.v1"
    static let limit = 30

    private struct Stored: Codable {
        var version = 1
        var checkIns: [CheckIn]
    }

    let defaults: UserDefaults

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
    }

    func checkIns() throws(ProgressError) -> [CheckIn] {
        guard let data = defaults.data(forKey: Self.key) else { return [] }
        guard let stored = try? JSONDecoder.progress.decode(Stored.self, from: data),
              stored.version == 1,
              stored.checkIns.count <= Self.limit,
              stored.checkIns.allSatisfy(\.isValid)
        else { throw .unreadableHistory }
        return stored.checkIns
    }

    @discardableResult
    func save(_ checkIn: CheckIn) throws(ProgressError) -> [CheckIn] {
        guard checkIn.isValid else { throw .invalidCheckIn }
        var next = try checkIns().filter { $0.id != checkIn.id }
        next.append(checkIn)
        next.sort { $0.date < $1.date }
        next = Array(next.suffix(Self.limit))
        guard let data = try? JSONEncoder.progress.encode(Stored(checkIns: next)) else { throw .invalidCheckIn }
        defaults.set(data, forKey: Self.key)
        return next
    }

    func clear() {
        defaults.removeObject(forKey: Self.key)
    }

    static func compare(_ before: CheckIn, _ after: CheckIn, ids: [MeasurementID]) throws(ProgressError) -> [ComparisonRow] {
        guard before.isValid, after.isValid else { throw .invalidCheckIn }
        guard before.id != after.id, before.date < after.date else { throw .wrongOrder }
        var seen = Set<MeasurementID>()
        return try ids.filter { seen.insert($0).inserted }.map { id throws(ProgressError) in
            guard let first = before.measurements.first(where: { $0.id == id }),
                  let last = after.measurements.first(where: { $0.id == id })
            else { throw .invalidCheckIn }
            return ComparisonRow(id: id, before: first.value, after: last.value)
        }
    }
}

private extension JSONEncoder {
    static let progress: JSONEncoder = {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        return encoder
    }()
}

private extension JSONDecoder {
    static let progress: JSONDecoder = {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return decoder
    }()
}

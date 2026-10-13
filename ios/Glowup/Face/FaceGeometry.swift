import Foundation

/// Port of `lib/face/geometry.ts`. Same landmark indices, pose limits and ratio definitions,
/// so iPhone values match the web app for the same photo.
nonisolated struct FaceGeometry {
    struct Point: Equatable {
        var x: Double
        var y: Double
        var z: Double
    }

    static let landmarkCount = 478
    static let sideRange = 32...4096
    /// Pose limits in degrees.
    static let maxYaw = 15.0
    static let maxPitch = 15.0
    static let maxRoll = 10.0

    /// Landmark index pairs: cheek span, mesh height, inner eye corners, mouth corners.
    static let cheek = (234, 454)
    static let meshHeight = (10, 152)
    static let innerEyes = (133, 362)
    static let mouth = (61, 291)

    /// Normalized landmarks, 0...1 in x and y relative to the photo.
    let landmarks: [Point]
    /// Decoded, upright pixel size.
    let width: Int
    let height: Int
    /// Facial transformation matrix, column-major like MediaPipe's serialized MatrixData.
    let transform: [Double]

    /// Rejects incomplete meshes and faces not looking straight at the camera.
    func validate() throws(FaceCheckFailure) {
        guard landmarks.count == Self.landmarkCount,
              Self.sideRange.contains(width), Self.sideRange.contains(height),
              transform.count == 16, transform.allSatisfy(\.isFinite),
              landmarks.allSatisfy({ (0...1).contains($0.x) && (0...1).contains($0.y) && (-2...2).contains($0.z) })
        else { throw .incompleteMesh }

        let m = transform
        let columns = [[m[0], m[1], m[2]], [m[4], m[5], m[6]], [m[8], m[9], m[10]]]
        let lengths = columns.map { sqrt($0.reduce(0) { $0 + $1 * $1 }) }
        guard lengths.allSatisfy({ (0.5...2).contains($0) }),
              abs(m[3]) + abs(m[7]) + abs(m[11]) <= 0.01,
              abs(m[15] - 1) <= 0.01
        else { throw .poseUnavailable }

        let r = zip(columns, lengths).map { column, length in column.map { $0 / length } }
        func dot(_ a: [Double], _ b: [Double]) -> Double { zip(a, b).reduce(0) { $0 + $1.0 * $1.1 } }
        guard abs(dot(r[0], r[1])) <= 0.05, abs(dot(r[0], r[2])) <= 0.05, abs(dot(r[1], r[2])) <= 0.05
        else { throw .poseUnreliable }

        // R = Rz(roll) Ry(yaw) Rx(pitch)
        let degrees = 180 / Double.pi
        let yaw = asin(max(-1, min(1, -r[0][2]))) * degrees
        let pitch = atan2(r[1][2], r[2][2]) * degrees
        let roll = atan2(r[0][1], r[0][0]) * degrees
        guard abs(yaw) <= Self.maxYaw, abs(pitch) <= Self.maxPitch, abs(roll) <= Self.maxRoll
        else { throw .notFacingCamera }
    }

    func ratios() throws(FaceCheckFailure) -> [Ratio] {
        try validate()
        func distance(_ pair: (Int, Int)) -> Double {
            let a = landmarks[pair.0], b = landmarks[pair.1]
            return hypot((a.x - b.x) * Double(width), (a.y - b.y) * Double(height))
        }
        let cheeks = distance(Self.cheek)
        let mesh = distance(Self.meshHeight)
        let eyes = distance(Self.innerEyes)
        let mouth = distance(Self.mouth)
        guard [cheeks, mesh, eyes, mouth].allSatisfy({ $0.isFinite && $0 > 0 }) else { throw .unusableSpans }
        return [
            Ratio(id: .faceWidthHeight, value: cheeks / mesh,
                  definition: "Cheek span (234–454) divided by upper face-mesh to chin span (10–152); this is not a hairline measurement."),
            Ratio(id: .innerEyeGapWidth, value: eyes / cheeks,
                  definition: "Inner eye corners (133–362) divided by cheek span (234–454)."),
            Ratio(id: .mouthWidthFaceWidth, value: mouth / cheeks,
                  definition: "Mouth corners (61–291) divided by cheek span (234–454)."),
        ]
    }
}

nonisolated struct Ratio: Identifiable, Equatable {
    let id: MeasurementID
    let value: Double
    let definition: String
    var label: String { id.label }
}

/// Same wording as the web app's errors.
nonisolated enum FaceCheckFailure: Error, Equatable {
    case unreadable
    case tooLarge
    case tooSmall
    case modelUnavailable
    case noFace
    case multipleFaces
    case incompleteMesh
    case poseUnavailable
    case poseUnreliable
    case notFacingCamera
    case unusableSpans

    var message: String {
        switch self {
        case .unreadable: "This photo couldn't be read. Try a JPEG, PNG or HEIC photo."
        case .tooLarge: "Choose a photo under 10 MB."
        case .tooSmall: "This photo is too small. Choose a larger one."
        case .modelUnavailable: "The face model couldn't be loaded. Restart the app and try again."
        case .noFace: "No clear face found. Use an evenly lit, front-facing photo."
        case .multipleFaces: "Use a photo with only one face."
        case .incompleteMesh: "The face mesh is incomplete or outside the photo. Try another photo."
        case .poseUnavailable: "The face pose could not be verified."
        case .poseUnreliable: "The face pose is unreliable."
        case .notFacingCamera: "Look straight at the camera and keep your head level."
        case .unusableSpans: "The measured spans are not usable. Choose another photo."
        }
    }
}

import CoreGraphics
import ImageIO
import MediaPipeTasksVision
import UIKit

/// On-device face check and proportions with MediaPipe Face Landmarker, configured like
/// `public/face-worker.js`, using the same `face_landmarker.task` model as the web app.
nonisolated struct FaceCheck {
    /// API v1 submission size: long edge at most 1536 px.
    static let maxLongEdge = 1536.0
    static let maxUploadBytes = 10 * 1024 * 1024

    struct Passed {
        /// Upright, resized photo ready for display or submission.
        let image: UIImage
        let geometry: FaceGeometry
        let ratios: [Ratio]
    }

    @concurrent
    func run(on data: Data) async throws(FaceCheckFailure) -> Passed {
        guard data.count <= Self.maxUploadBytes else { throw .tooLarge }
        let cgImage = try Self.uprightImage(from: data)
        guard FaceGeometry.sideRange.contains(cgImage.width), FaceGeometry.sideRange.contains(cgImage.height)
        else { throw .tooSmall }

        let image = UIImage(cgImage: cgImage)
        let landmarker = try Self.makeLandmarker()
        guard let mpImage = try? MPImage(uiImage: image),
              let result = try? landmarker.detect(image: mpImage)
        else { throw .unreadable }

        // numFaces is 2 so a second face is detected and rejected rather than ignored.
        guard let face = result.faceLandmarks.first else { throw .noFace }
        guard result.faceLandmarks.count == 1 else { throw .multipleFaces }
        guard let matrix = result.facialTransformationMatrixes.first,
              matrix.rows == 4, matrix.columns == 4
        else { throw .poseUnavailable }

        // `data` is already column-major (translation in 12...14), exactly what the web
        // geometry code receives. `value(atRow:column:)` reads it as row-major, so don't use it.
        let transform = (0..<16).map { Double(matrix.data[$0]) }
        let geometry = FaceGeometry(
            landmarks: face.map { FaceGeometry.Point(x: Double($0.x), y: Double($0.y), z: Double($0.z)) },
            width: cgImage.width,
            height: cgImage.height,
            transform: transform
        )
        return Passed(image: image, geometry: geometry, ratios: try geometry.ratios())
    }

    private static func makeLandmarker() throws(FaceCheckFailure) -> FaceLandmarker {
        guard let path = Bundle.main.path(forResource: "face_landmarker", ofType: "task") else { throw .modelUnavailable }
        let options = FaceLandmarkerOptions()
        options.baseOptions.modelAssetPath = path
        options.runningMode = .image
        options.numFaces = 2
        options.minFaceDetectionConfidence = 0.7
        options.minFacePresenceConfidence = 0.7
        options.outputFacialTransformationMatrixes = true
        guard let landmarker = try? FaceLandmarker(options: options) else { throw .modelUnavailable }
        return landmarker
    }

    /// Decodes once, applies EXIF orientation and caps the long edge, like the web flow.
    private static func uprightImage(from data: Data) throws(FaceCheckFailure) -> CGImage {
        guard let source = CGImageSourceCreateWithData(data as CFData, nil),
              let properties = CGImageSourceCopyPropertiesAtIndex(source, 0, nil) as? [CFString: Any],
              let width = properties[kCGImagePropertyPixelWidth] as? Double,
              let height = properties[kCGImagePropertyPixelHeight] as? Double
        else { throw .unreadable }
        let options: [CFString: Any] = [
            kCGImageSourceCreateThumbnailFromImageAlways: true,
            kCGImageSourceCreateThumbnailWithTransform: true,
            kCGImageSourceThumbnailMaxPixelSize: min(max(width, height), maxLongEdge),
        ]
        guard let image = CGImageSourceCreateThumbnailAtIndex(source, 0, options as CFDictionary) else { throw .unreadable }
        return image
    }
}

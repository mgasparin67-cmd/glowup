import Foundation

/// Mirrors `QuestionnaireSchema` in `lib/contracts.ts` so it can be sent to API v1 unchanged.
struct Questionnaire: Codable, Equatable {
    enum Sensitivity: String, Codable, CaseIterable, Identifiable {
        case unknown, yes, no
        var id: Self { self }
        var label: String {
            switch self {
            case .unknown: "Not sure"
            case .yes: "Yes"
            case .no: "No"
            }
        }
    }

    static let maxConcerns = 10
    static let maxNoteLength = 500
    static let maxCountryLength = 80

    /// Labels from `lib/skin-concerns.ts`, plus "Acne", which is iPhone-only for now.
    static let concernOptions = [
        "Acne", "Blemishes", "Dryness", "Oiliness", "Uneven tone", "Visible redness",
        "Irritated or itchy patches", "Fine lines", "Sun protection", "Texture", "Under-eye concerns",
    ]

    var concerns: [String] = []
    var sensitivity: Sensitivity = .unknown
    var allergies = ""
    var currentProducts = ""
    var budget: Double?
    var country = ""

    mutating func toggle(_ concern: String) {
        if let index = concerns.firstIndex(of: concern) {
            concerns.remove(at: index)
        } else if concerns.count < Self.maxConcerns {
            concerns.append(concern)
        }
    }

    /// True when every field fits the server's limits.
    var isValid: Bool {
        concerns.count <= Self.maxConcerns
            && allergies.count <= Self.maxNoteLength
            && currentProducts.count <= Self.maxNoteLength
            && country.count <= Self.maxCountryLength
            && (budget.map { $0.isFinite && $0 >= 0 } ?? true)
    }
}

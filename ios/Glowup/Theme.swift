import SwiftUI

/// Liquid-glass palette from `docs/liquid-glass-design.md` and the web app's CSS tokens.
enum Theme {
    static let ink = Color(red: 0x10 / 255, green: 0x28 / 255, blue: 0x3F / 255)
    static let muted = Color(red: 0x46 / 255, green: 0x5F / 255, blue: 0x78 / 255)
    static let accent = Color(red: 0x12 / 255, green: 0x67 / 255, blue: 0xBE / 255)
    static let paper = Color(red: 0xF5 / 255, green: 0xFA / 255, blue: 0xFF / 255)
    static let wash = Color(red: 0xEA / 255, green: 0xF4 / 255, blue: 0xFF / 255)
    static let line = Color(red: 0xCB / 255, green: 0xDC / 255, blue: 0xE9 / 255)

    /// Faint, static baby-blue canvas.
    static let canvas = LinearGradient(
        colors: [paper, wash, Color(red: 0xF3 / 255, green: 0xF0 / 255, blue: 0xFF / 255)],
        startPoint: .top,
        endPoint: .bottomTrailing
    )
}

/// Opaque content card: text-heavy content stays readable instead of sitting on glass.
struct Card<Content: View>: View {
    @ViewBuilder var content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 12) { content }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(20)
            .background(.white, in: .rect(cornerRadius: 20))
            .overlay(RoundedRectangle(cornerRadius: 20).strokeBorder(Theme.line))
    }
}

struct ScreenBackground: ViewModifier {
    func body(content: Content) -> some View {
        content
            .scrollContentBackground(.hidden)
            .background(Theme.canvas.ignoresSafeArea())
    }
}

extension View {
    func glowupBackground() -> some View { modifier(ScreenBackground()) }
}

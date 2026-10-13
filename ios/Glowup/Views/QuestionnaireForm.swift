import SwiftUI

/// Native version of `components/skin-questionnaire.tsx`.
struct QuestionnaireForm: View {
    @Binding var answers: Questionnaire

    var body: some View {
        Card {
            StepHeading(number: 1, title: "A little about your skin")
            Text("Your answers add context that a photo can’t provide. Unknown is okay.")
                .font(.subheadline)
                .foregroundStyle(Theme.muted)

            FieldLabel("What would you like to focus on?")
            FlowLayout(spacing: 8) {
                ForEach(Questionnaire.concernOptions, id: \.self) { concern in
                    let selected = answers.concerns.contains(concern)
                    Button {
                        answers.toggle(concern)
                    } label: {
                        Text(concern)
                            .font(.subheadline)
                            .padding(.horizontal, 12)
                            .frame(minHeight: 44)
                            .background(selected ? Theme.wash : .white, in: .capsule)
                            .overlay(Capsule().strokeBorder(selected ? Theme.accent : Theme.line, lineWidth: selected ? 1.5 : 1))
                    }
                    .buttonStyle(.plain)
                    .accessibilityAddTraits(selected ? .isSelected : [])
                }
            }

            FieldLabel("Is your skin sensitive?")
            Picker("Is your skin sensitive?", selection: $answers.sensitivity) {
                ForEach(Questionnaire.Sensitivity.allCases) { Text($0.label).tag($0) }
            }
            .pickerStyle(.segmented)
            .labelsHidden()

            FieldLabel("Known ingredient allergies", optional: true)
            LimitedField("Separate ingredients with commas", text: $answers.allergies, limit: Questionnaire.maxNoteLength)
            Text("Exact ingredient matches are excluded. Synonyms need further review.")
                .font(.caption)
                .foregroundStyle(Theme.muted)

            FieldLabel("Products you currently use", optional: true)
            LimitedField("For example: cleanser, moisturizer, sunscreen", text: $answers.currentProducts, limit: Questionnaire.maxNoteLength)

            FieldLabel("Shopping country")
            LimitedField("Unknown or country name", text: $answers.country, limit: Questionnaire.maxCountryLength, multiline: false)
                .textContentType(.countryName)

            FieldLabel("Budget per product", optional: true)
            TextField("Optional", value: $answers.budget, format: .number.precision(.fractionLength(0...2)))
                .keyboardType(.decimalPad)
                .fieldStyle()
            Text("In your country’s currency, when known.")
                .font(.caption)
                .foregroundStyle(Theme.muted)
        }
    }
}

struct StepHeading: View {
    let number: Int
    let title: String

    var body: some View {
        HStack(spacing: 12) {
            Text(number, format: .number.precision(.integerLength(2)))
                .font(.caption.monospacedDigit().weight(.semibold))
                .foregroundStyle(Theme.accent)
                .frame(width: 32, height: 32)
                .background(Theme.wash, in: .circle)
            Text(title).font(.title2.bold())
        }
        .accessibilityElement(children: .combine)
    }
}

private struct FieldLabel: View {
    let text: String
    let optional: Bool

    init(_ text: String, optional: Bool = false) {
        self.text = text
        self.optional = optional
    }

    var body: some View {
        HStack(spacing: 6) {
            Text(text).font(.subheadline.weight(.semibold))
            if optional {
                Text("optional").font(.caption).foregroundStyle(Theme.muted)
            }
        }
        .padding(.top, 8)
    }
}

/// Text field that never exceeds the server's character limit.
private struct LimitedField: View {
    let prompt: String
    @Binding var text: String
    let limit: Int
    var multiline = true

    init(_ prompt: String, text: Binding<String>, limit: Int, multiline: Bool = true) {
        self.prompt = prompt
        _text = text
        self.limit = limit
        self.multiline = multiline
    }

    var body: some View {
        TextField(prompt, text: $text, axis: multiline ? .vertical : .horizontal)
            .lineLimit(multiline ? 2...4 : 1...1)
            .fieldStyle()
            .onChange(of: text) { _, newValue in
                if newValue.count > limit { text = String(newValue.prefix(limit)) }
            }
    }
}

private extension View {
    func fieldStyle() -> some View {
        padding(.horizontal, 12)
            .padding(.vertical, 12)
            .frame(minHeight: 48)
            .background(.white, in: .rect(cornerRadius: 10))
            .overlay(RoundedRectangle(cornerRadius: 10).strokeBorder(Theme.line))
    }
}

/// Wraps chips onto new lines when a row is full.
struct FlowLayout: Layout {
    var spacing: CGFloat = 8

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let rows = arrange(subviews, width: proposal.width ?? .infinity)
        let height = rows.last.map { $0.y + $0.height } ?? 0
        let width = rows.map(\.width).max() ?? 0
        return CGSize(width: proposal.width ?? width, height: height)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        for row in arrange(subviews, width: bounds.width) {
            var x = bounds.minX
            for index in row.indices {
                let size = subviews[index].sizeThatFits(.unspecified)
                subviews[index].place(at: CGPoint(x: x, y: bounds.minY + row.y), proposal: ProposedViewSize(size))
                x += size.width + spacing
            }
        }
    }

    private struct Row {
        var indices: [Int] = []
        var y: CGFloat = 0
        var width: CGFloat = 0
        var height: CGFloat = 0
    }

    private func arrange(_ subviews: Subviews, width: CGFloat) -> [Row] {
        var rows = [Row()]
        for index in subviews.indices {
            let size = subviews[index].sizeThatFits(.unspecified)
            let needed = rows[rows.count - 1].indices.isEmpty ? size.width : rows[rows.count - 1].width + spacing + size.width
            if needed > width, !rows[rows.count - 1].indices.isEmpty {
                let last = rows[rows.count - 1]
                rows.append(Row(y: last.y + last.height + spacing))
            }
            var row = rows[rows.count - 1]
            row.width = row.indices.isEmpty ? size.width : row.width + spacing + size.width
            row.height = max(row.height, size.height)
            row.indices.append(index)
            rows[rows.count - 1] = row
        }
        return rows
    }
}

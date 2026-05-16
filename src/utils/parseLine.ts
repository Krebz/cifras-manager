type Token = {
    type: "chord" | "text"
    value: string
}

export function parseLine(line: string): Token[] {
    const tokens: Token[] = []

    const regex = /\[(.*?)\]/g

    let lastIndex = 0

    for (const match of line.matchAll(regex)) {
        const chord = match[1]

        const matchIndex = match.index ?? 0

        const textBefore = line.slice(lastIndex, matchIndex)

        if (textBefore) {
            tokens.push({
                type: "text",
                value: textBefore,
            })
        }

        tokens.push({
            type: "chord",
            value: chord,
        })

        lastIndex = matchIndex + match[0].length
    }

    const remainingText = line.slice(lastIndex)

    if (remainingText) {
        tokens.push({
            type: "text",
            value: remainingText,
        })
    }

    return tokens
}
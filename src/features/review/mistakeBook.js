const MISTAKE_BOOK_KEY = 'wordHeroMistakeBook'

function isValidMistake(item) {
  return (
    item &&
    typeof item === 'object' &&
    typeof item.wordId === 'string' &&
    typeof item.word === 'string' &&
    typeof item.zh_tw === 'string' &&
    typeof item.theme === 'string' &&
    typeof item.level === 'string' &&
    Number.isInteger(item.mistakeCount) &&
    item.mistakeCount > 0 &&
    typeof item.lastMistakeAt === 'string' &&
    Number.isInteger(item.reviewCount) &&
    item.reviewCount >= 0
  )
}

function writeMistakeBook(mistakes) {
  try {
    localStorage.setItem(MISTAKE_BOOK_KEY, JSON.stringify(mistakes))
  } catch {
    return false
  }

  return true
}

export function getMistakeBook() {
  try {
    const storedValue = localStorage.getItem(MISTAKE_BOOK_KEY)

    if (!storedValue) return []

    const mistakes = JSON.parse(storedValue)
    return Array.isArray(mistakes) && mistakes.every(isValidMistake)
      ? mistakes
      : []
  } catch {
    return []
  }
}

export function saveMistakesFromHistory(answerHistory) {
  if (!Array.isArray(answerHistory)) return getMistakeBook()

  const mistakes = getMistakeBook()
  const mistakeByWordId = new Map(
    mistakes.map((mistake) => [mistake.wordId, mistake]),
  )
  const uniqueMistakes = new Map()

  answerHistory.forEach((answer) => {
    if (
      answer?.hadMistake === true &&
      typeof answer.wordId === 'string' &&
      typeof answer.word === 'string' &&
      typeof answer.zh_tw === 'string' &&
      typeof answer.theme === 'string' &&
      typeof answer.level === 'string' &&
      !uniqueMistakes.has(answer.wordId)
    ) {
      uniqueMistakes.set(answer.wordId, answer)
    }
  })

  const lastMistakeAt = new Date().toISOString()

  uniqueMistakes.forEach((answer, wordId) => {
    const savedMistake = mistakeByWordId.get(wordId)

    mistakeByWordId.set(wordId, {
      wordId,
      word: answer.word,
      zh_tw: answer.zh_tw,
      theme: answer.theme,
      level: answer.level,
      mistakeCount: (savedMistake?.mistakeCount ?? 0) + 1,
      lastMistakeAt,
      reviewCount: savedMistake?.reviewCount ?? 0,
    })
  })

  const updatedMistakes = Array.from(mistakeByWordId.values())
  writeMistakeBook(updatedMistakes)
  return updatedMistakes
}

export function clearMistakeBook() {
  try {
    localStorage.removeItem(MISTAKE_BOOK_KEY)
  } catch {
    return false
  }

  return true
}

export function removeMistake(wordId) {
  const updatedMistakes = getMistakeBook().filter(
    (mistake) => mistake.wordId !== wordId,
  )

  writeMistakeBook(updatedMistakes)
  return updatedMistakes
}

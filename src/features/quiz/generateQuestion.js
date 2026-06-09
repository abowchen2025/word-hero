import { QUESTION_TYPES } from './questionTypes'

const SUPPORTED_TYPES = Object.values(QUESTION_TYPES)
const OPTION_COUNT = 4

function getRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)]
}

function shuffle(items) {
  const shuffledItems = [...items]

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffledItems[index], shuffledItems[randomIndex]] = [
      shuffledItems[randomIndex],
      shuffledItems[index],
    ]
  }

  return shuffledItems
}

function getLabel(wordEntry, questionType) {
  return questionType === QUESTION_TYPES.ZH_TO_EN
    ? wordEntry.word
    : wordEntry.zh_tw
}

function getAvailableTypes(wordEntry) {
  return wordEntry.question_types.filter((type) =>
    SUPPORTED_TYPES.includes(type),
  )
}

export function generateQuestion(wordBank, optionWordBank = wordBank) {
  if (!Array.isArray(wordBank) || wordBank.length === 0) {
    throw new Error('題目產生器至少需要 1 個正解單字。')
  }

  if (!Array.isArray(optionWordBank) || optionWordBank.length < OPTION_COUNT) {
    throw new Error('題目產生器至少需要 4 個選項單字。')
  }

  const eligibleWords = wordBank.filter(
    (wordEntry) => getAvailableTypes(wordEntry).length > 0,
  )

  if (eligibleWords.length === 0) {
    throw new Error('字庫中沒有支援的題型。')
  }

  const correctWord = getRandomItem(eligibleWords)
  const type = getRandomItem(getAvailableTypes(correctWord))
  const correctLabel = getLabel(correctWord, type)
  const usedLabels = new Set([correctLabel])
  const distractors = shuffle(
    optionWordBank.filter((wordEntry) => wordEntry.id !== correctWord.id),
  )
    .filter((wordEntry) => {
      const label = getLabel(wordEntry, type)

      if (usedLabels.has(label)) return false

      usedLabels.add(label)
      return true
    })
    .slice(0, OPTION_COUNT - 1)

  if (distractors.length < OPTION_COUNT - 1) {
    throw new Error('字庫中沒有足夠的不重複選項。')
  }

  const options = shuffle([
    { id: correctWord.id, label: correctLabel, isCorrect: true },
    ...distractors.map((wordEntry) => ({
      id: wordEntry.id,
      label: getLabel(wordEntry, type),
      isCorrect: false,
    })),
  ])

  return {
    id: `question-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    prompt:
      type === QUESTION_TYPES.ZH_TO_EN
        ? `請選出「${correctWord.zh_tw}」的英文`
        : `${correctWord.word} 是什麼意思？`,
    correctAnswer: correctLabel,
    correctWordId: correctWord.id,
    options,
  }
}

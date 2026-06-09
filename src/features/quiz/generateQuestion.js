import { QUESTION_TYPES } from './questionTypes'

export function generateQuestion(wordEntry) {
  return {
    id: wordEntry.id,
    type: QUESTION_TYPES.MULTIPLE_CHOICE,
    prompt: `請選出「${wordEntry.meaning}」的英文`,
    answer: wordEntry.word,
    options: wordEntry.options,
  }
}

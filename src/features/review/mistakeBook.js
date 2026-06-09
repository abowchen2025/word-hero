export function addMistake(mistakes, question) {
  const alreadySaved = mistakes.some((item) => item.id === question.id)
  return alreadySaved ? mistakes : [...mistakes, question]
}

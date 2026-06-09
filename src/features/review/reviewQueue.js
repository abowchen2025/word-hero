export function createReviewQueue(mistakes, limit = 5) {
  return mistakes.slice(0, limit)
}

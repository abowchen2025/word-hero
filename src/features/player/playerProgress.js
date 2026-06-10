const PLAYER_PROGRESS_KEY = 'wordHeroPlayerProgress'

const DEFAULT_PLAYER_PROGRESS = {
  totalCoins: 0,
  earnedBadges: [],
  completedQuests: 0,
  highestCombo: 0,
  totalCorrectFirstTry: 0,
  totalMistakes: 0,
  lastPlayedAt: '',
}

function getDefaultPlayerProgress() {
  return {
    ...DEFAULT_PLAYER_PROGRESS,
    earnedBadges: [],
  }
}

function isNonNegativeInteger(value) {
  return Number.isInteger(value) && value >= 0
}

function isValidBadge(badge) {
  return (
    badge &&
    typeof badge === 'object' &&
    typeof badge.id === 'string' &&
    typeof badge.name === 'string' &&
    typeof badge.icon === 'string' &&
    typeof badge.description === 'string'
  )
}

function isValidPlayerProgress(progress) {
  return (
    progress &&
    typeof progress === 'object' &&
    isNonNegativeInteger(progress.totalCoins) &&
    Array.isArray(progress.earnedBadges) &&
    progress.earnedBadges.every(isValidBadge) &&
    isNonNegativeInteger(progress.completedQuests) &&
    isNonNegativeInteger(progress.highestCombo) &&
    isNonNegativeInteger(progress.totalCorrectFirstTry) &&
    isNonNegativeInteger(progress.totalMistakes) &&
    typeof progress.lastPlayedAt === 'string'
  )
}

export function getPlayerProgress() {
  try {
    const storedValue = localStorage.getItem(PLAYER_PROGRESS_KEY)

    if (!storedValue) return getDefaultPlayerProgress()

    const progress = JSON.parse(storedValue)
    return isValidPlayerProgress(progress)
      ? progress
      : getDefaultPlayerProgress()
  } catch {
    return getDefaultPlayerProgress()
  }
}

export function savePlayerProgress(progress) {
  const progressToSave = isValidPlayerProgress(progress)
    ? progress
    : getDefaultPlayerProgress()

  try {
    localStorage.setItem(PLAYER_PROGRESS_KEY, JSON.stringify(progressToSave))
  } catch {
    return progressToSave
  }

  return progressToSave
}

export function updatePlayerProgress(result = {}, rewards = {}) {
  const battleMode = result.battleMode ?? result.mode ?? 'normal'

  if (battleMode === 'review' || rewards.isReview === true) {
    return getPlayerProgress()
  }

  const currentProgress = getPlayerProgress()
  const earnedBadgeById = new Map(
    currentProgress.earnedBadges.map((badge) => [badge.id, badge]),
  )

  if (Array.isArray(rewards.badges)) {
    rewards.badges.filter(isValidBadge).forEach((badge) => {
      earnedBadgeById.set(badge.id, badge)
    })
  }

  return savePlayerProgress({
    totalCoins:
      currentProgress.totalCoins +
      (isNonNegativeInteger(rewards.coins) ? rewards.coins : 0),
    earnedBadges: Array.from(earnedBadgeById.values()),
    completedQuests: currentProgress.completedQuests + 1,
    highestCombo: Math.max(
      currentProgress.highestCombo,
      isNonNegativeInteger(result.maxCombo) ? result.maxCombo : 0,
    ),
    totalCorrectFirstTry:
      currentProgress.totalCorrectFirstTry +
      (isNonNegativeInteger(result.correctCount) ? result.correctCount : 0),
    totalMistakes:
      currentProgress.totalMistakes +
      (isNonNegativeInteger(result.wrongCount) ? result.wrongCount : 0),
    lastPlayedAt: new Date().toISOString(),
  })
}

export function resetPlayerProgress() {
  try {
    localStorage.removeItem(PLAYER_PROGRESS_KEY)
  } catch {
    return getDefaultPlayerProgress()
  }

  return getDefaultPlayerProgress()
}

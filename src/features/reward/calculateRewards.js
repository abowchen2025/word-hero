const BADGES = [
  {
    id: 'first_clear',
    name: '首次通關',
    icon: '🏆',
    description: '完成一場英文冒險',
  },
  {
    id: 'perfect_clear',
    name: '完美通關',
    icon: '🌟',
    description: '10 題全部首次答對',
  },
  {
    id: 'combo_master',
    name: '連擊小勇者',
    icon: '⚔️',
    description: '最高 Combo 達到 5',
  },
  {
    id: 'brave_retry',
    name: '勇敢再試',
    icon: '🛡️',
    description: '答錯後仍完成任務',
  },
]

const REWARD_MESSAGES = {
  3: '太棒了！你是今天的英文小勇者！',
  2: '很不錯！再複習一下就更強了！',
  1: '你完成任務了，勇敢嘗試很重要！',
  0: '沒關係，先從錯題複習開始！',
}

const REVIEW_MESSAGES = {
  3: '太棒了！錯題幾乎都掌握了！',
  2: '進步很多，再複習一次會更穩！',
  1: '有開始複習就很棒，繼續加油！',
  0: '沒關係，先從這幾個單字慢慢來！',
}

export function calculateRewards(result = {}, mode) {
  const stars = result.stars ?? 0
  const battleMode = mode ?? result.battleMode ?? result.mode ?? 'normal'

  if (battleMode === 'review') {
    return {
      stars,
      coins: 0,
      badges: [],
      rewardMessage: REVIEW_MESSAGES[stars] ?? REVIEW_MESSAGES[0],
      isReview: true,
    }
  }

  const correctCount = result.correctCount ?? 0
  const totalQuestions = result.totalQuestions ?? 0
  const wrongCount = result.wrongCount ?? 0
  const maxCombo = result.maxCombo ?? 0
  const isPerfectClear =
    totalQuestions > 0 &&
    correctCount === totalQuestions &&
    wrongCount === 0

  const coins =
    20 +
    correctCount * 5 +
    (stars === 3 ? 20 : 0) +
    (maxCombo >= 5 ? 10 : 0) +
    (wrongCount === 0 ? 20 : 0)

  const badges = BADGES.filter((badge) => {
    if (badge.id === 'perfect_clear') return isPerfectClear
    if (badge.id === 'combo_master') return maxCombo >= 5
    if (badge.id === 'brave_retry') return wrongCount > 0
    return badge.id === 'first_clear'
  })

  return {
    stars,
    coins,
    badges,
    rewardMessage: REWARD_MESSAGES[stars] ?? REWARD_MESSAGES[0],
    isReview: false,
  }
}

import { BATTLE_RULES } from './battleRules'

export function calculateDamage(isCorrect) {
  return isCorrect
    ? BATTLE_RULES.correctAnswerDamage
    : BATTLE_RULES.wrongAnswerDamage
}

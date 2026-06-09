import { useState } from 'react'
import AnswerOption from '../components/AnswerOption'
import HeroCard from '../components/HeroCard'
import MonsterCard from '../components/MonsterCard'
import QuestionCard from '../components/QuestionCard'
import starterWords from '../data/wordBanks/starter1.json'
import { calculateDamage } from '../features/battle/calculateDamage'
import { checkAnswer } from '../features/quiz/checkAnswer'
import { generateQuestion } from '../features/quiz/generateQuestion'

function createQuestion() {
  return generateQuestion(starterWords)
}

function BattlePage({ stage, onComplete, onBack }) {
  const [question, setQuestion] = useState(createQuestion)
  const [selectedOptionId, setSelectedOptionId] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false)
  const [monsterHealth, setMonsterHealth] = useState(60)

  function handleAnswer(option) {
    if (answeredCorrectly) return

    const isCorrect = checkAnswer(option)
    setSelectedOptionId(option.id)
    setAnsweredCorrectly(isCorrect)
    setFeedback(
      isCorrect ? '答對了！小勇者攻擊成功！' : '差一點，再試一次！',
    )

    if (isCorrect) {
      setMonsterHealth((health) =>
        Math.max(0, health - calculateDamage(true)),
      )
    }
  }

  function handleNextQuestion() {
    setQuestion(createQuestion())
    setSelectedOptionId(null)
    setFeedback('')
    setAnsweredCorrectly(false)
  }

  function getAnswerStatus(option) {
    if (selectedOptionId !== option.id) return 'idle'
    return option.isCorrect ? 'correct' : 'wrong'
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-blue-50 to-slate-100 px-5 py-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black tracking-[0.2em] text-blue-600 uppercase">
              Current Quest
            </p>
            <h1 className="mt-1 text-xl font-black text-slate-950 sm:text-2xl">
              {stage?.name ?? 'Starter Village'}{' '}
              {stage?.nameZh ?? '新手村'}
            </h1>
          </div>
          <button
            type="button"
            className="min-h-12 rounded-xl border-2 border-slate-300 bg-white px-4 py-2 font-bold text-slate-700 hover:bg-slate-50"
            onClick={onBack}
          >
            返回地圖
          </button>
        </header>

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <HeroCard />
          <MonsterCard health={monsterHealth} />
        </section>

        <div className="mt-6">
          <QuestionCard prompt={question.prompt}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {question.options.map((option) => (
                <AnswerOption
                  key={option.id}
                  label={option.label}
                  status={getAnswerStatus(option)}
                  disabled={answeredCorrectly}
                  onClick={() => handleAnswer(option)}
                />
              ))}
            </div>

            <div
              className={`mt-5 min-h-14 rounded-2xl p-4 text-center font-bold ${
                feedback
                  ? answeredCorrectly
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                  : 'bg-white/70 text-slate-500'
              }`}
              aria-live="polite"
            >
              {feedback || '選出正確答案，幫助小勇者發動攻擊！'}
            </div>

            {answeredCorrectly && (
              <button
                type="button"
                className="mt-5 min-h-14 w-full rounded-2xl bg-blue-600 px-6 py-4 text-lg font-black text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
                onClick={handleNextQuestion}
              >
                下一題
              </button>
            )}

            <button
              type="button"
              className="mt-3 min-h-14 w-full rounded-2xl border-2 border-amber-500 bg-amber-100 px-6 py-4 text-lg font-black text-amber-900 hover:bg-amber-200"
              onClick={onComplete}
            >
              完成關卡
            </button>
          </QuestionCard>
        </div>
      </div>
    </main>
  )
}

export default BattlePage

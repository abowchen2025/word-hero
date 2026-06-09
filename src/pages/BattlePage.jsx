import { useMemo, useState } from 'react'
import AnswerOption from '../components/AnswerOption'
import HeroCard from '../components/HeroCard'
import MonsterCard from '../components/MonsterCard'
import QuestionCard from '../components/QuestionCard'
import starterWords from '../data/wordBanks/starter1.json'
import { calculateDamage } from '../features/battle/calculateDamage'
import { checkAnswer } from '../features/quiz/checkAnswer'
import { generateQuestion } from '../features/quiz/generateQuestion'

function BattlePage({ stage, onComplete, onBack }) {
  const question = useMemo(() => generateQuestion(starterWords[0]), [])
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [monsterHealth, setMonsterHealth] = useState(60)
  const isComplete = selectedAnswer === question.answer

  function handleAnswer(answer) {
    const isCorrect = checkAnswer(answer, question.answer)
    setSelectedAnswer(answer)
    setFeedback(isCorrect ? '答對了！勇者成功發動攻擊。' : '再試一次，你一定找得到！')

    if (isCorrect) {
      setMonsterHealth((health) =>
        Math.max(0, health - calculateDamage(true)),
      )
    }
  }

  function getAnswerStatus(answer) {
    if (selectedAnswer !== answer) return 'idle'
    return answer === question.answer ? 'correct' : 'wrong'
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
              {stage?.name ?? 'Starter Village'} {stage?.nameZh ?? '入門村'}
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
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {question.options.map((answer) => (
                <AnswerOption
                  key={answer}
                  label={answer}
                  status={getAnswerStatus(answer)}
                  onClick={() => handleAnswer(answer)}
                />
              ))}
            </div>

            <div
              className={`mt-5 min-h-14 rounded-2xl p-4 text-center font-bold ${
                feedback
                  ? isComplete
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                  : 'bg-white/70 text-slate-500'
              }`}
              aria-live="polite"
            >
              {feedback || '選一個答案，幫助勇者攻擊怪物！'}
            </div>

            <button
              type="button"
              className="mt-5 min-h-14 w-full rounded-2xl bg-blue-600 px-6 py-4 text-lg font-black text-white shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              disabled={!isComplete}
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

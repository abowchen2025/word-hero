import { useState } from 'react'
import AnswerOption from '../components/AnswerOption'
import HeroCard from '../components/HeroCard'
import MonsterCard from '../components/MonsterCard'
import QuestionCard from '../components/QuestionCard'
import starterWords from '../data/wordBanks/starter1.json'
import { checkAnswer } from '../features/quiz/checkAnswer'
import { generateQuestion } from '../features/quiz/generateQuestion'

const TOTAL_QUESTIONS = 10
const MONSTER_MAX_HEALTH = 100
const DAMAGE_PER_QUESTION = MONSTER_MAX_HEALTH / TOTAL_QUESTIONS

function createQuestion() {
  return generateQuestion(starterWords)
}

function calculateStars(correctCount) {
  if (correctCount >= 9) return 3
  if (correctCount >= 6) return 2
  if (correctCount >= 1) return 1
  return 0
}

function BattlePage({ stage, onComplete, onBack }) {
  const [question, setQuestion] = useState(createQuestion)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1)
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [answerHistory, setAnswerHistory] = useState([])
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const [hadMistake, setHadMistake] = useState(false)
  const [monsterHealth, setMonsterHealth] = useState(MONSTER_MAX_HEALTH)

  const progress = (currentQuestionIndex / TOTAL_QUESTIONS) * 100

  function handleAnswer(option) {
    if (answeredCorrectly) return

    const isCorrect = checkAnswer(option)
    const nextSelectedAnswers = [...selectedAnswers, option.label]

    setSelectedOption(option)
    setSelectedAnswers(nextSelectedAnswers)
    setAnsweredCorrectly(isCorrect)
    setFeedback(
      isCorrect ? '答對了！小勇者攻擊成功！' : '差一點，再試一次！',
    )

    if (isCorrect) {
      const pointsEarned = hadMistake ? 5 : 10
      const wordEntry = starterWords.find(
        (word) => word.id === question.correctWordId,
      )

      setScore((currentScore) => currentScore + pointsEarned)
      if (!hadMistake) {
        setCorrectCount((count) => count + 1)
      }
      setAnswerHistory((history) => [
        ...history,
        {
          questionNumber: currentQuestionIndex,
          questionType: question.type,
          wordId: wordEntry.id,
          word: wordEntry.word,
          zh_tw: wordEntry.zh_tw,
          isCorrectFirstTry: !hadMistake,
          hadMistake,
          selectedAnswers: nextSelectedAnswers,
        },
      ])
      setMonsterHealth((health) =>
        Math.max(0, health - DAMAGE_PER_QUESTION),
      )
    } else if (!hadMistake) {
      setHadMistake(true)
      setWrongCount((count) => count + 1)
    }
  }

  function handleNextQuestion() {
    if (currentQuestionIndex === TOTAL_QUESTIONS) {
      onComplete({
        score,
        totalQuestions: TOTAL_QUESTIONS,
        correctCount,
        wrongCount,
        stars: calculateStars(correctCount),
        answerHistory,
      })
      return
    }

    setQuestion(createQuestion())
    setCurrentQuestionIndex((index) => index + 1)
    setSelectedOption(null)
    setSelectedAnswers([])
    setHadMistake(false)
    setFeedback('')
    setAnsweredCorrectly(false)
  }

  function getAnswerStatus(option) {
    if (selectedOption?.id !== option.id) return 'idle'
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

        <section className="mb-6 rounded-3xl border-2 border-blue-200 bg-white p-5 shadow-lg shadow-blue-100">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 font-black">
            <p className="text-lg text-slate-950">
              第 {currentQuestionIndex} / {TOTAL_QUESTIONS} 題
            </p>
            <div className="flex gap-5 text-sm sm:text-base">
              <p className="text-blue-700">分數：{score}</p>
              <p className="text-emerald-700">答對：{correctCount}</p>
            </div>
          </div>
          <div
            className="mt-4 h-4 overflow-hidden rounded-full bg-slate-200"
            role="progressbar"
            aria-label="關卡進度"
            aria-valuemin="0"
            aria-valuemax={TOTAL_QUESTIONS}
            aria-valuenow={currentQuestionIndex}
          >
            <div
              className="h-full rounded-full bg-linear-to-r from-blue-500 to-amber-400 transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <HeroCard />
          <MonsterCard
            health={monsterHealth}
            maxHealth={MONSTER_MAX_HEALTH}
          />
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
                {currentQuestionIndex === TOTAL_QUESTIONS
                  ? '完成任務'
                  : '下一題'}
              </button>
            )}
          </QuestionCard>
        </div>
      </div>
    </main>
  )
}

export default BattlePage

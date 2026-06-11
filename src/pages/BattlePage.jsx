import { useEffect, useRef, useState } from 'react'
import AnswerOption from '../components/AnswerOption'
import HeroCard from '../components/HeroCard'
import MonsterCard from '../components/MonsterCard'
import QuestionCard from '../components/QuestionCard'
import starterWords from '../data/wordBanks/starter1.json'
import { checkAnswer } from '../features/quiz/checkAnswer'
import { generateQuestion } from '../features/quiz/generateQuestion'
import { getMistakeBook } from '../features/review/mistakeBook'
import { useKeyboardControls } from '../hooks/useKeyboardControls'
import { useSpeech } from '../hooks/useSpeech'

const NORMAL_QUESTION_COUNT = 10
const INITIAL_MONSTER_HP = 100

function getStageWordBank(stage) {
  if (!Array.isArray(stage?.themes) || stage.themes.length === 0) {
    return starterWords
  }

  const stageThemes = new Set(stage.themes)
  const filteredWords = starterWords.filter((word) =>
    stageThemes.has(word.theme),
  )

  return filteredWords.length >= 4 ? filteredWords : starterWords
}

function createNormalQuestion(wordBank) {
  return generateQuestion(wordBank)
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

function createBattleSetup(battleMode, stage) {
  if (battleMode !== 'review') {
    const normalWords = getStageWordBank(stage)

    return {
      normalWords,
      reviewWords: [],
      totalQuestions: NORMAL_QUESTION_COUNT,
      firstQuestion: createNormalQuestion(normalWords),
    }
  }

  const mistakeIds = new Set(
    getMistakeBook().map((mistake) => mistake.wordId),
  )
  const reviewWords = shuffle(
    starterWords.filter((word) => mistakeIds.has(word.id)),
  ).slice(0, NORMAL_QUESTION_COUNT)

  return {
    normalWords: [],
    reviewWords,
    totalQuestions: reviewWords.length,
    firstQuestion:
      reviewWords.length > 0
        ? generateQuestion([reviewWords[0]], starterWords)
        : null,
  }
}

function calculateStars(correctCount, totalQuestions) {
  if (totalQuestions > 0 && correctCount / totalQuestions >= 0.9) return 3
  if (totalQuestions > 0 && correctCount / totalQuestions >= 0.6) return 2
  if (correctCount >= 1) return 1
  return 0
}

function BattlePage({ stage, battleMode = 'normal', onComplete, onBack }) {
  const [battleSetup] = useState(() => createBattleSetup(battleMode, stage))
  const { normalWords, reviewWords, totalQuestions, firstQuestion } =
    battleSetup
  const [question, setQuestion] = useState(firstQuestion)
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
  const [monsterMaxHp] = useState(INITIAL_MONSTER_HP)
  const [monsterHp, setMonsterHp] = useState(INITIAL_MONSTER_HP)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [battleMessage, setBattleMessage] = useState('')
  const [lastDamage, setLastDamage] = useState(0)
  const [totalDamage, setTotalDamage] = useState(0)
  const [defeatedMonsters, setDefeatedMonsters] = useState(0)
  const answerLockedRef = useRef(false)
  const nextActionLockedRef = useRef(false)
  const { speak, isSupported: isSpeechSupported, isSpeaking } = useSpeech()

  const progress =
    totalQuestions > 0 ? (currentQuestionIndex / totalQuestions) * 100 : 0
  const currentWord = question
    ? starterWords.find((word) => word.id === question.correctWordId)
    : null

  function speakCurrentWord() {
    if (currentWord) {
      speak(currentWord.word)
    }
  }

  function handleAnswer(option) {
    if (answeredCorrectly || answerLockedRef.current) return

    const isCorrect = checkAnswer(option)
    const nextSelectedAnswers = [...selectedAnswers, option.label]

    if (isCorrect) {
      answerLockedRef.current = true
    }

    setSelectedOption(option)
    setSelectedAnswers(nextSelectedAnswers)
    setAnsweredCorrectly(isCorrect)

    if (isCorrect) {
      const pointsEarned = hadMistake ? 5 : 10
      const nextCombo = combo + 1
      const comboBonus = nextCombo >= 5 ? 5 : nextCombo >= 3 ? 3 : 0
      const damage = pointsEarned + comboBonus
      const nextMonsterHp = Math.max(0, monsterHp - damage)
      const wordEntry = starterWords.find(
        (word) => word.id === question.correctWordId,
      )

      setFeedback('答對了！')
      setScore((currentScore) => currentScore + pointsEarned)
      setCombo(nextCombo)
      setMaxCombo((currentMaxCombo) =>
        Math.max(currentMaxCombo, nextCombo),
      )
      setLastDamage(damage)
      setTotalDamage((currentTotal) => currentTotal + damage)
      setMonsterHp(nextMonsterHp)
      setBattleMessage(
        nextMonsterHp === 0
          ? `答對了！小勇者造成 ${damage} 點傷害！怪物被擊退了！`
          : comboBonus > 0
            ? `答對了！小勇者造成 ${damage} 點傷害！Combo ${nextCombo}！追加傷害！`
            : `答對了！小勇者造成 ${damage} 點傷害！`,
      )
      if (nextMonsterHp === 0) {
        setDefeatedMonsters((count) => count + 1)
      }
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
          theme: wordEntry.theme,
          level: wordEntry.level,
          isCorrectFirstTry: !hadMistake,
          hadMistake,
          selectedAnswers: nextSelectedAnswers,
          damage,
          combo: nextCombo,
        },
      ])
    } else {
      setFeedback('再試一次！')
      setCombo(0)
      setLastDamage(0)
      setBattleMessage('怪物防禦成功，再試一次！')
      if (!hadMistake) {
        setHadMistake(true)
        setWrongCount((count) => count + 1)
      }
    }
  }

  function handleNextQuestion() {
    if (!answeredCorrectly || nextActionLockedRef.current) return

    nextActionLockedRef.current = true

    if (currentQuestionIndex === totalQuestions) {
      onComplete({
        battleMode,
        stage: battleMode === 'review' ? null : stage,
        score,
        totalQuestions,
        correctCount,
        wrongCount,
        stars: calculateStars(correctCount, totalQuestions),
        answerHistory,
        maxCombo,
        totalDamage,
        defeatedMonsters,
      })
      return
    }

    const shouldResetMonster = monsterHp === 0
    setQuestion(
      battleMode === 'review'
        ? generateQuestion([reviewWords[currentQuestionIndex]], starterWords)
        : createNormalQuestion(normalWords),
    )
    setCurrentQuestionIndex((index) => index + 1)
    setSelectedOption(null)
    setSelectedAnswers([])
    setHadMistake(false)
    setFeedback('')
    setLastDamage(0)
    if (shouldResetMonster) {
      setMonsterHp(monsterMaxHp)
      setBattleMessage('新的小怪物出現！')
    } else {
      setBattleMessage('')
    }
    setAnsweredCorrectly(false)
    answerLockedRef.current = false
    nextActionLockedRef.current = false
  }

  function getAnswerStatus(option) {
    if (selectedOption?.id !== option.id) return 'idle'
    return option.isCorrect ? 'correct' : 'wrong'
  }

  useKeyboardControls({
    onAnswer: (optionIndex) => {
      const option = question?.options[optionIndex]

      if (option) {
        handleAnswer(option)
      }
    },
    onEnter: handleNextQuestion,
    onSpace: speakCurrentWord,
    enabled: Boolean(question),
  })

  useEffect(() => {
    if (currentWord) {
      speak(currentWord.word)
    }
  }, [question?.id, currentWord, speak])

  if (!question) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-linear-to-b from-blue-50 to-slate-100 px-5 py-12">
        <section className="w-full max-w-xl rounded-3xl border-2 border-blue-200 bg-white p-7 text-center shadow-xl shadow-blue-100 sm:p-10">
          <p className="text-sm font-black tracking-[0.2em] text-blue-600 uppercase">
            Review Quest
          </p>
          <h1 className="mt-3 text-3xl font-black text-slate-950">
            目前沒有錯題
          </h1>
          <p className="mt-4 text-lg font-bold text-slate-600">
            先去完成一關冒險吧！
          </p>
          <button
            type="button"
            className="mt-7 min-h-16 w-full touch-manipulation rounded-2xl bg-blue-600 px-6 py-4 text-lg font-black text-white hover:bg-blue-700 active:bg-blue-800"
            onClick={onBack}
          >
            回世界地圖
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-blue-50 to-slate-100 px-5 py-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black tracking-[0.2em] text-blue-600 uppercase">
              {battleMode === 'review' ? 'Review Quest' : 'Current Quest'}
            </p>
            <h1 className="mt-1 text-xl font-black text-slate-950 sm:text-2xl">
              {battleMode === 'review'
                ? '錯題複習'
                : `${stage?.name ?? 'Starter Village'} ${stage?.name_zh ?? '入門村'}`}
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
              第 {currentQuestionIndex} / {totalQuestions} 題
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
            aria-valuemax={totalQuestions}
            aria-valuenow={currentQuestionIndex}
          >
            <div
              className="h-full rounded-full bg-linear-to-r from-blue-500 to-amber-400 transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <HeroCard combo={combo} maxCombo={maxCombo} />
          <MonsterCard
            health={monsterHp}
            maxHealth={monsterMaxHp}
            name={
              battleMode === 'review'
                ? 'Review Monster'
                : stage?.monster?.name
            }
            nameZh={
              battleMode === 'review'
                ? '複習小怪獸'
                : stage?.monster?.name_zh
            }
            icon={battleMode === 'review' ? '👾' : stage?.monster?.icon}
          />
        </section>

        <section
          className={`mt-5 min-h-20 rounded-3xl border-2 p-4 text-center ${
            battleMessage
              ? answeredCorrectly
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : 'border-amber-200 bg-amber-50 text-amber-900'
              : 'border-slate-200 bg-white/80 text-slate-500'
          }`}
          aria-live="polite"
        >
          <p className="font-black">
            {battleMessage || '選出正確答案，幫助小勇者攻擊！'}
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3 text-sm font-bold">
            <span>Combo {combo}</span>
            {lastDamage > 0 && <span>本次傷害 {lastDamage}</span>}
          </div>
        </section>

        <div className="mt-6">
          <QuestionCard prompt={question.prompt}>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                className="min-h-16 touch-manipulation rounded-2xl bg-violet-600 px-6 py-4 text-lg font-black text-white shadow-lg shadow-violet-200 hover:bg-violet-700 active:bg-violet-800 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
                onClick={speakCurrentWord}
                disabled={!isSpeechSupported}
              >
                {isSpeaking ? '播放中…' : '聽發音'}
              </button>

              <div className="hidden flex-wrap justify-end gap-2 text-xs font-bold text-slate-600 sm:flex">
                <span className="rounded-lg bg-white/80 px-3 py-2">
                  按 1～4 選答案
                </span>
                <span className="rounded-lg bg-white/80 px-3 py-2">
                  Enter {currentQuestionIndex === totalQuestions ? '完成任務' : '下一題'}
                </span>
                <span className="rounded-lg bg-white/80 px-3 py-2">
                  Space 重播發音
                </span>
              </div>
            </div>

            {!isSpeechSupported && (
              <p
                className="mb-4 rounded-2xl bg-slate-100 px-4 py-3 text-center font-bold text-slate-600"
                role="status"
              >
                你的瀏覽器目前不支援發音功能
              </p>
            )}

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {question.options.map((option, optionIndex) => (
                <AnswerOption
                  key={option.id}
                  number={optionIndex + 1}
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
                className="mt-5 min-h-16 w-full touch-manipulation rounded-2xl bg-blue-600 px-6 py-4 text-lg font-black text-white shadow-lg shadow-blue-200 hover:bg-blue-700 active:bg-blue-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                onClick={handleNextQuestion}
              >
                {currentQuestionIndex === totalQuestions
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

import { useEffect, useRef, useState } from 'react'
import {
  clearMistakeBook,
  getMistakeBook,
  saveMistakesFromHistory,
} from '../features/review/mistakeBook'
import { updatePlayerProgress } from '../features/player/playerProgress'
import { calculateRewards } from '../features/reward/calculateRewards'

const emptyResult = {
  score: 0,
  totalQuestions: 10,
  correctCount: 0,
  wrongCount: 0,
  stars: 0,
  answerHistory: [],
  maxCombo: 0,
  totalDamage: 0,
  defeatedMonsters: 0,
  battleMode: 'normal',
}

function ResultPage({
  result = emptyResult,
  battleMode = 'normal',
  onPlayAgain,
  onReviewMistakes,
  onWorldMap,
  onHome,
}) {
  const battleResult = result ?? emptyResult
  const resolvedBattleMode =
    battleResult.battleMode ?? battleResult.mode ?? battleMode
  const rewards = calculateRewards(battleResult, resolvedBattleMode)
  const isReviewMode = resolvedBattleMode === 'review'
  const reviewWords = Array.from(
    new Map(
      battleResult.answerHistory
        .filter((answer) => answer.hadMistake)
        .map((answer) => [answer.wordId, answer]),
    ).values(),
  )
  const [mistakeBook, setMistakeBook] = useState(getMistakeBook)
  const hasSavedResultRef = useRef(false)

  useEffect(() => {
    if (hasSavedResultRef.current) return

    hasSavedResultRef.current = true
    setMistakeBook(saveMistakesFromHistory(battleResult.answerHistory))
    if (!isReviewMode) {
      updatePlayerProgress(battleResult, rewards)
    }
  }, [battleResult, isReviewMode, rewards])

  function handleClearMistakeBook() {
    if (!window.confirm('確定要清空錯題本嗎？')) return

    clearMistakeBook()
    setMistakeBook([])
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-blue-950 px-5 py-12">
      <section className="w-full max-w-2xl rounded-[2rem] bg-white p-6 text-center shadow-2xl sm:p-10">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-amber-400 text-3xl font-black text-amber-950">
          {battleResult.stars} ★
        </div>
        <p className="mt-6 text-sm font-black tracking-[0.2em] text-blue-600 uppercase">
          {isReviewMode ? 'Review Results' : 'Quest Clear'}
        </p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">
          {isReviewMode ? '錯題複習完成！' : '任務完成！'}
        </h1>
        {!isReviewMode && (
          <p className="mt-3 text-lg font-black text-blue-700">
            完成冒險：{battleResult.stage?.name_zh ?? '入門村'}
          </p>
        )}
        <p className="mt-4 text-xl font-bold text-slate-600">
          {isReviewMode ? '本次複習表現：' : '本次獲得 '}
          <span className="text-amber-500">{battleResult.stars} 顆星</span>
        </p>

        <dl className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-blue-50 p-4">
            <dt className="text-sm font-bold text-blue-700">本次分數</dt>
            <dd className="mt-1 text-3xl font-black text-slate-950">
              {battleResult.score}
            </dd>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-4">
            <dt className="text-sm font-bold text-emerald-700">首次答對</dt>
            <dd className="mt-1 text-3xl font-black text-slate-950">
              {battleResult.correctCount} / {battleResult.totalQuestions}
            </dd>
          </div>
          <div className="rounded-2xl bg-rose-50 p-4">
            <dt className="text-sm font-bold text-rose-700">答錯次數</dt>
            <dd className="mt-1 text-3xl font-black text-slate-950">
              {battleResult.wrongCount}
            </dd>
          </div>
          <div className="rounded-2xl bg-amber-50 p-4">
            <dt className="text-sm font-bold text-amber-700">最高 Combo</dt>
            <dd className="mt-1 text-3xl font-black text-slate-950">
              {battleResult.maxCombo ?? 0}
            </dd>
          </div>
          <div className="rounded-2xl bg-violet-50 p-4">
            <dt className="text-sm font-bold text-violet-700">總傷害</dt>
            <dd className="mt-1 text-3xl font-black text-slate-950">
              {battleResult.totalDamage ?? 0}
            </dd>
          </div>
          <div className="rounded-2xl bg-cyan-50 p-4">
            <dt className="text-sm font-bold text-cyan-700">擊退怪物</dt>
            <dd className="mt-1 text-3xl font-black text-slate-950">
              {battleResult.defeatedMonsters ?? 0}
            </dd>
          </div>
        </dl>

        {isReviewMode ? (
          <section className="mt-6 rounded-3xl border-2 border-blue-200 bg-linear-to-br from-blue-50 to-cyan-50 p-5 text-center shadow-lg shadow-blue-100 sm:p-6">
            <p className="text-xs font-black tracking-[0.2em] text-blue-700 uppercase">
              Review Progress
            </p>
            <h2 className="mt-1 text-2xl font-black text-blue-950">
              複習結果
            </h2>
            <p className="mt-4 rounded-2xl bg-white px-4 py-4 text-lg font-black text-blue-950">
              {rewards.rewardMessage}
            </p>
          </section>
        ) : (
          <section className="mt-6 rounded-3xl border-2 border-amber-300 bg-linear-to-br from-amber-50 via-yellow-50 to-orange-50 p-5 text-left shadow-lg shadow-amber-100 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black tracking-[0.2em] text-amber-700 uppercase">
                  Quest Rewards
                </p>
                <h2 className="mt-1 text-2xl font-black text-amber-950">
                  本次獎勵
                </h2>
              </div>
              <div className="rounded-2xl border-2 border-amber-300 bg-white px-5 py-3 text-center shadow-sm">
                <p className="text-sm font-bold text-amber-700">獲得金幣</p>
                <p className="mt-1 text-3xl font-black text-amber-950">
                  🪙 +{rewards.coins}
                </p>
              </div>
            </div>

            <h3 className="mt-6 font-black text-amber-950">獲得徽章</h3>
            <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {rewards.badges.map((badge) => (
                <li
                  key={badge.id}
                  className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-white p-4 shadow-sm"
                >
                  <span
                    className="grid size-12 shrink-0 place-items-center rounded-full bg-amber-100 text-2xl"
                    aria-hidden="true"
                  >
                    {badge.icon}
                  </span>
                  <div>
                    <p className="font-black text-slate-950">{badge.name}</p>
                    <p className="mt-1 text-sm font-bold text-slate-600">
                      {badge.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-5 rounded-2xl bg-amber-500 px-4 py-4 text-center text-lg font-black text-amber-950">
              {rewards.rewardMessage}
            </p>
          </section>
        )}

        {reviewWords.length > 0 && (
          <section className="mt-6 rounded-2xl border-2 border-amber-200 bg-amber-50 p-5 text-left">
            <h2 className="font-black text-amber-900">本次需要複習：</h2>
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {reviewWords.map((answer) => (
                <li
                  key={answer.wordId}
                  className="rounded-xl bg-white px-4 py-3 font-bold text-slate-800"
                >
                  {answer.word} <span className="text-slate-500">{answer.zh_tw}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-6 rounded-2xl border-2 border-blue-200 bg-blue-50 p-5 text-left">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-black text-blue-950">本機錯題本</h2>
            <p className="text-sm font-black text-blue-700">
              共 {mistakeBook.length} 個單字
            </p>
          </div>

          {mistakeBook.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {mistakeBook.slice(0, 5).map((mistake) => (
                <li
                  key={mistake.wordId}
                  className="rounded-xl bg-white px-4 py-3 font-bold text-slate-800"
                >
                  {mistake.word}{' '}
                  <span className="text-slate-500">{mistake.zh_tw}</span>
                  <span className="text-rose-600">
                    {' '}
                    ｜錯 {mistake.mistakeCount} 次
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 rounded-xl bg-white px-4 py-3 font-bold text-slate-600">
              目前沒有需要複習的單字。
            </p>
          )}

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {mistakeBook.length > 0 && (
              <button
                type="button"
                className="min-h-14 touch-manipulation rounded-2xl bg-blue-600 px-5 py-4 text-lg font-black text-white hover:bg-blue-700 active:bg-blue-800"
                onClick={onReviewMistakes}
              >
                複習錯題
              </button>
            )}
            <button
              type="button"
              className="min-h-14 touch-manipulation rounded-2xl border-2 border-rose-300 bg-white px-5 py-4 text-lg font-black text-rose-700 hover:bg-rose-50 active:bg-rose-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
              onClick={handleClearMistakeBook}
              disabled={mistakeBook.length === 0}
            >
              清空錯題本
            </button>
          </div>
        </section>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <button
            type="button"
            className="min-h-14 rounded-2xl bg-blue-600 px-6 py-4 text-lg font-black text-white hover:bg-blue-700"
            onClick={onPlayAgain}
          >
            再玩一次
          </button>
          <button
            type="button"
            className="min-h-14 rounded-2xl border-2 border-amber-400 bg-amber-100 px-5 py-4 text-lg font-black text-amber-900 hover:bg-amber-200"
            onClick={onWorldMap}
          >
            回世界地圖
          </button>
          <button
            type="button"
            className="min-h-14 rounded-2xl border-2 border-slate-300 bg-white px-5 py-4 text-lg font-black text-slate-700 hover:bg-slate-50"
            onClick={onHome}
          >
            回首頁
          </button>
        </div>
      </section>
    </main>
  )
}

export default ResultPage

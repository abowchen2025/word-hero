import { useEffect, useRef, useState } from 'react'
import {
  clearMistakeBook,
  getMistakeBook,
  saveMistakesFromHistory,
} from '../features/review/mistakeBook'

const emptyResult = {
  score: 0,
  totalQuestions: 10,
  correctCount: 0,
  wrongCount: 0,
  stars: 0,
  answerHistory: [],
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
  }, [battleResult.answerHistory])

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
          Quest Clear
        </p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">
          {battleMode === 'review' ? '錯題複習完成！' : '任務完成！'}
        </h1>
        <p className="mt-4 text-xl font-bold text-slate-600">
          本次獲得{' '}
          <span className="text-amber-500">{battleResult.stars} 顆星</span>
        </p>

        <dl className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-blue-50 p-4">
            <dt className="text-sm font-bold text-blue-700">本次分數</dt>
            <dd className="mt-1 text-3xl font-black text-slate-950">
              {battleResult.score}
            </dd>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-4">
            <dt className="text-sm font-bold text-emerald-700">答對題數</dt>
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
        </dl>

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

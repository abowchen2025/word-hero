import { useState } from 'react'
import stages from '../data/stages.json'
import {
  getPlayerProgress,
  resetPlayerProgress,
} from '../features/player/playerProgress'

const themeClasses = {
  amber: 'border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-400',
  emerald:
    'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-400',
  rose: 'border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-400',
  blue: 'border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-400',
}

function WorldMapPage({ onSelectStage, onHome }) {
  const [playerProgress, setPlayerProgress] = useState(getPlayerProgress)

  function handleResetPlayerProgress() {
    if (
      !window.confirm(
        '確定要重新開始勇者紀錄嗎？總金幣和徽章會清空。',
      )
    ) {
      return
    }

    setPlayerProgress(resetPlayerProgress())
  }

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black tracking-[0.2em] text-blue-600 uppercase">
              Adventure Map
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
              選擇你的冒險地圖
            </h1>
            <p className="mt-2 text-slate-600">每一站都有新的英文任務。</p>
          </div>
          <button
            type="button"
            className="min-h-12 rounded-xl border-2 border-slate-300 bg-white px-5 py-3 font-bold text-slate-700 hover:bg-slate-50"
            onClick={onHome}
          >
            回首頁
          </button>
        </header>

        <section className="mb-8 rounded-3xl border-2 border-amber-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black tracking-[0.2em] text-amber-700 uppercase">
                Hero Record
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                勇者紀錄
              </h2>
            </div>
            <button
              type="button"
              className="min-h-12 rounded-xl border-2 border-rose-200 bg-rose-50 px-4 py-3 font-bold text-rose-700 hover:bg-rose-100 sm:w-auto"
              onClick={handleResetPlayerProgress}
            >
              重置勇者紀錄
            </button>
          </div>

          <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-amber-50 p-4 text-center">
              <dt className="text-sm font-bold text-amber-700">總金幣</dt>
              <dd className="mt-1 text-3xl font-black text-amber-950">
                {playerProgress.totalCoins}
              </dd>
            </div>
            <div className="rounded-2xl bg-violet-50 p-4 text-center">
              <dt className="text-sm font-bold text-violet-700">
                已獲得徽章
              </dt>
              <dd className="mt-1 text-3xl font-black text-violet-950">
                {playerProgress.earnedBadges.length} 個
              </dd>
            </div>
            <div className="rounded-2xl bg-blue-50 p-4 text-center">
              <dt className="text-sm font-bold text-blue-700">完成冒險</dt>
              <dd className="mt-1 text-3xl font-black text-blue-950">
                {playerProgress.completedQuests} 次
              </dd>
            </div>
          </dl>
        </section>

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {stages.map((stage, index) => (
            <button
              key={stage.id}
              type="button"
              className={`group min-h-52 rounded-3xl border-2 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${themeClasses[stage.theme]}`}
              onClick={() => onSelectStage(stage)}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-lg font-black shadow-sm">
                  {stage.badge}
                </span>
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-black">
                  STAGE {index + 1}
                </span>
              </div>
              <h2 className="mt-6 text-2xl font-black text-slate-950">
                {stage.name}
              </h2>
              <p className="mt-1 text-lg font-bold">{stage.nameZh}</p>
              <p className="mt-3 leading-relaxed text-slate-600">
                {stage.description}
              </p>
            </button>
          ))}
        </section>
      </div>
    </main>
  )
}

export default WorldMapPage

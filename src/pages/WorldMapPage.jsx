import stages from '../data/stages.json'

const themeClasses = {
  amber: 'border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-400',
  emerald:
    'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-400',
  rose: 'border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-400',
  blue: 'border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-400',
}

function WorldMapPage({ onSelectStage, onHome }) {
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

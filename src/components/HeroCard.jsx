function HeroCard({ combo = 0, maxCombo = 0 }) {
  return (
    <article className="rounded-3xl border-2 border-blue-200 bg-white p-5 shadow-lg shadow-blue-100">
      <div className="mb-4 flex items-center gap-4">
        <div
          className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-blue-600 text-3xl"
          aria-hidden="true"
        >
          🦸
        </div>
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase">
            Word Hero
          </p>
          <h2 className="text-xl font-black text-slate-900">英文小勇者</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-blue-50 p-3 text-center">
          <p className="text-xs font-bold text-blue-700">目前 Combo</p>
          <p className="mt-1 text-2xl font-black text-blue-950">{combo}</p>
        </div>
        <div className="rounded-2xl bg-amber-50 p-3 text-center">
          <p className="text-xs font-bold text-amber-700">最高 Combo</p>
          <p className="mt-1 text-2xl font-black text-amber-950">
            {maxCombo}
          </p>
        </div>
      </div>
    </article>
  )
}

export default HeroCard

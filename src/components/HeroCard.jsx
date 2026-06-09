import ExpBar from './ExpBar'
import HealthBar from './HealthBar'

function HeroCard() {
  return (
    <article className="rounded-3xl border-2 border-blue-200 bg-white p-5 shadow-lg shadow-blue-100">
      <div className="mb-4 flex items-center gap-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-blue-600 text-xl font-black text-white">
          WH
        </div>
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase">
            Level 1 Hero
          </p>
          <h2 className="text-xl font-black text-slate-900">單字小勇者</h2>
        </div>
      </div>
      <div className="space-y-3">
        <HealthBar value={100} />
        <ExpBar value={30} />
      </div>
    </article>
  )
}

export default HeroCard

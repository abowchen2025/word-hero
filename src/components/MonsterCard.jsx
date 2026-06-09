import HealthBar from './HealthBar'

function MonsterCard({ health = 100, maxHealth = 100 }) {
  return (
    <article className="rounded-3xl border-2 border-violet-200 bg-white p-5 shadow-lg shadow-violet-100">
      <div className="mb-4 flex items-center gap-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-violet-600 text-xl font-black text-white">
          M
        </div>
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-violet-600 uppercase">
            Word Monster
          </p>
          <h2 className="text-xl font-black text-slate-900">迷糊小怪物</h2>
        </div>
      </div>
      <HealthBar value={health} max={maxHealth} label="怪物 HP" />
    </article>
  )
}

export default MonsterCard

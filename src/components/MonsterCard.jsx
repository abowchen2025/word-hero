function MonsterCard({ health = 100, maxHealth = 100 }) {
  const percentage = Math.max(0, Math.min(100, (health / maxHealth) * 100))
  const isInDanger = percentage < 30

  return (
    <article
      className={`rounded-3xl border-2 bg-white p-5 shadow-lg ${
        isInDanger
          ? 'border-rose-400 shadow-rose-100'
          : 'border-violet-200 shadow-violet-100'
      }`}
    >
      <div className="mb-4 flex items-center gap-4">
        <div
          className={`grid h-16 w-16 shrink-0 place-items-center rounded-full text-3xl ${
            isInDanger ? 'bg-rose-100' : 'bg-violet-100'
          }`}
          aria-hidden="true"
        >
          👾
        </div>
        <div>
          <p
            className={`text-xs font-bold tracking-[0.2em] uppercase ${
              isInDanger ? 'text-rose-600' : 'text-violet-600'
            }`}
          >
            {isInDanger ? 'Danger' : 'Word Monster'}
          </p>
          <h2 className="text-xl font-black text-slate-900">單字小怪獸</h2>
        </div>
      </div>
      <div>
        <div className="mb-1 flex items-center justify-between text-xs font-bold text-slate-600">
          <span>怪物 HP</span>
          <span>
            HP {health} / {maxHealth}
          </span>
        </div>
        <div
          className="h-4 overflow-hidden rounded-full bg-slate-200"
          role="progressbar"
          aria-label="怪物生命值"
          aria-valuemin="0"
          aria-valuemax={maxHealth}
          aria-valuenow={health}
        >
          <div
            className={`h-full rounded-full transition-[width,background-color] ${
              isInDanger ? 'bg-rose-600' : 'bg-violet-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {isInDanger && (
          <p className="mt-2 text-sm font-black text-rose-600">
            怪物快要被擊退了！
          </p>
        )}
      </div>
    </article>
  )
}

export default MonsterCard

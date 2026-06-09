function HealthBar({ value, max = 100, label = 'HP' }) {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100))

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs font-bold text-slate-600">
        <span>{label}</span>
        <span>
          {value}/{max}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-rose-500 transition-[width]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default HealthBar

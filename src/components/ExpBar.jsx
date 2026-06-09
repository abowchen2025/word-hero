function ExpBar({ value, max = 100 }) {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100))

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs font-bold text-slate-600">
        <span>EXP</span>
        <span>
          {value}/{max}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-amber-400 transition-[width]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ExpBar

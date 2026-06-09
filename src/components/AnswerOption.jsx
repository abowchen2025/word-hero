function AnswerOption({
  number,
  label,
  onClick,
  status = 'idle',
  disabled = false,
}) {
  const statusClasses = {
    idle:
      'border-slate-200 bg-white text-slate-800 hover:border-blue-400 hover:bg-blue-50 active:border-blue-500 active:bg-blue-100',
    correct:
      'border-emerald-500 bg-emerald-100 text-emerald-900 shadow-emerald-200',
    wrong: 'border-rose-500 bg-rose-100 text-rose-900 shadow-rose-200',
  }

  return (
    <button
      type="button"
      className={`flex min-h-16 touch-manipulation items-center gap-3 rounded-2xl border-2 px-5 py-4 text-left text-lg font-black shadow-sm transition-[background-color,border-color,transform] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:active:scale-100 ${statusClasses[status]}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={`答案 ${number}：${label}`}
    >
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-900/8 text-base"
        aria-hidden="true"
      >
        {number}.
      </span>
      <span>{label}</span>
    </button>
  )
}

export default AnswerOption

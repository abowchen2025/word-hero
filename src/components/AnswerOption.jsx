function AnswerOption({ label, onClick, status = 'idle', disabled = false }) {
  const statusClasses = {
    idle:
      'border-slate-200 bg-white text-slate-800 hover:border-blue-400 hover:bg-blue-50',
    correct: 'border-emerald-500 bg-emerald-100 text-emerald-900',
    wrong: 'border-rose-400 bg-rose-50 text-rose-800',
  }

  return (
    <button
      type="button"
      className={`min-h-14 rounded-2xl border-2 px-5 py-3 text-lg font-black shadow-sm transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${statusClasses[status]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}

export default AnswerOption

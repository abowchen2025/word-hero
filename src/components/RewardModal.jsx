function RewardModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-5">
      <div
        className="w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reward-title"
      >
        <p className="mb-2 text-sm font-black tracking-[0.2em] text-amber-600 uppercase">
          Quest Reward
        </p>
        <h2 id="reward-title" className="text-2xl font-black text-slate-900">
          獲得 3 顆星！
        </h2>
        <button
          type="button"
          className="mt-6 min-h-12 w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
          onClick={onClose}
        >
          收下獎勵
        </button>
      </div>
    </div>
  )
}

export default RewardModal

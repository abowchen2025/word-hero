function ResultPage({ onPlayAgain, onHome }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-blue-950 px-5 py-12">
      <section className="w-full max-w-xl rounded-[2rem] bg-white p-7 text-center shadow-2xl sm:p-10">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-amber-400 text-3xl font-black text-amber-950">
          3
        </div>
        <p className="mt-6 text-sm font-black tracking-[0.2em] text-blue-600 uppercase">
          Quest Clear
        </p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">任務完成！</h1>
        <p className="mt-4 text-xl font-bold text-slate-600">
          本次獲得 <span className="text-amber-500">3 顆星</span>
        </p>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="min-h-14 rounded-2xl bg-blue-600 px-6 py-4 text-lg font-black text-white hover:bg-blue-700"
            onClick={onPlayAgain}
          >
            再玩一次
          </button>
          <button
            type="button"
            className="min-h-14 rounded-2xl border-2 border-slate-300 bg-white px-6 py-4 text-lg font-black text-slate-700 hover:bg-slate-50"
            onClick={onHome}
          >
            回首頁
          </button>
        </div>
      </section>
    </main>
  )
}

export default ResultPage

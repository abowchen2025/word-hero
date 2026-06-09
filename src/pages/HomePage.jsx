function HomePage({ onStart }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-5 py-12 text-white">
      <div className="absolute top-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
      <section className="relative w-full max-w-3xl rounded-[2rem] border border-white/15 bg-white/10 p-7 text-center shadow-2xl backdrop-blur sm:p-12">
        <div className="mx-auto mb-7 grid h-24 w-24 place-items-center rounded-3xl border-4 border-amber-300 bg-blue-600 text-3xl font-black shadow-lg shadow-blue-950">
          WH
        </div>
        <p className="mb-3 text-sm font-black tracking-[0.25em] text-amber-300 uppercase">
          Begin Your English Quest
        </p>
        <h1 className="text-4xl leading-tight font-black sm:text-5xl">
          Word Hero 英文小勇者
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-blue-100 sm:text-xl">
          每天 5 分鐘，完成你的單字冒險任務！
        </p>
        <button
          type="button"
          className="mt-9 min-h-14 w-full rounded-2xl bg-amber-400 px-8 py-4 text-lg font-black text-slate-950 shadow-lg shadow-amber-950/30 transition-colors hover:bg-amber-300 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-amber-300 sm:w-auto"
          onClick={onStart}
        >
          開始冒險
        </button>
      </section>
    </main>
  )
}

export default HomePage

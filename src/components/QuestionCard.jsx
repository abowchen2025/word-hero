function QuestionCard({ prompt, children }) {
  return (
    <section className="rounded-3xl border-2 border-amber-200 bg-amber-50 p-5 sm:p-7">
      <p className="mb-2 text-sm font-black tracking-[0.18em] text-amber-700 uppercase">
        Battle Mission
      </p>
      <h2 className="text-2xl leading-snug font-black text-slate-900 sm:text-3xl">
        {prompt}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  )
}

export default QuestionCard

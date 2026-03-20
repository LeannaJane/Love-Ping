type InformationProps = {
  steps: string[];
};

export default function Information({
  steps,
}: InformationProps) {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-7xl px-6 py-12 md:py-20"
    >
      <div className="grid gap-8 rounded-[2rem] bg-slate-900 px-8 py-10 text-white md:grid-cols-[1.1fr_0.9fr] md:px-10 md:py-12">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-300">
            How it works
          </p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Get set up in minutes.
          </h2>
          <p className="max-w-xl leading-7 text-slate-300">
            LovePing is built to remove friction. You connect once, then the app
            gently supports your relationship through small, repeatable moments.
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step}
              className="flex items-start gap-4 rounded-3xl bg-white/5 p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-400 font-bold text-slate-900">
                {index + 1}
              </div>
              <p className="pt-2 text-slate-100">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
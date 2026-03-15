type Feature = {
  title: string;
  text: string;
  icon: string;
};

type FeaturesSectionProps = {
  features: Feature[];
};

export default function FeaturesSection({
  features,
}: FeaturesSectionProps) {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-12 md:py-20">
      <div className="max-w-2xl space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
          Features
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Designed to make emotional check-ins feel natural.
        </h2>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm"
          >
            <div className="text-3xl">{feature.icon}</div>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">
              {feature.title}
            </h3>
            <p className="mt-3 leading-7 text-slate-600">{feature.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
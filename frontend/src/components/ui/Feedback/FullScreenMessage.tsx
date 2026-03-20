type FullScreenMessageProps = {
  title: string;
  subtitle?: string;
  animated?: boolean;
};

export default function FullScreenMessage({
  title,
  subtitle,
  animated = false,
}: FullScreenMessageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 via-white to-pink-50">
      <div className="rounded-3xl border border-pink-100 bg-white/80 px-8 py-6 text-center shadow-lg backdrop-blur">
        <p
          className={`text-xl font-semibold text-rose-500 ${
            animated ? "animate-pulse" : ""
          }`}
        >
          {title}
        </p>

        {subtitle && (
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
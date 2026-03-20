type SectionHeaderProps = {
  title: string;
  subtitle: string;
  icon: string;
};

export default function SectionHeader({
  title,
  subtitle,
  icon,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        <p className="mt-2 text-slate-500">{subtitle}</p>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  );
}
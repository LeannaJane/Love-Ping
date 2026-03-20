type StatCardProps = {
  label: string;
  value: string;
  className?: string;
};

export default function StatCard({
  label,
  value,
  className = "",
}: StatCardProps) {
  return (
    <div className={`rounded-3xl p-5 shadow-sm ${className}`}>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-bold text-pink-600">{value}</p>
    </div>
  );
}
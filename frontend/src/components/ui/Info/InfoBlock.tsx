type InfoBlockProps = {
  label: string;
  value: string;
  className?: string;
  valueClassName?: string;
};

export default function InfoBlock({
  label,
  value,
  className = "",
  valueClassName = "",
}: InfoBlockProps) {
  return (
    <div className={`rounded-2xl p-4 ${className}`}>
      <p className="text-sm text-slate-500">{label}</p>
      <p
        className={`mt-1 break-all font-semibold text-slate-700 ${valueClassName}`}
      >
        {value}
      </p>
    </div>
  );
}
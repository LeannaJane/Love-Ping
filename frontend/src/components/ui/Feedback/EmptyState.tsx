type EmptyStateProps = {
  title?: string;
  text: string;
  icon?: string;
};

export default function EmptyState({
  title,
  text,
  icon,
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl bg-rose-50 p-4 text-center text-slate-500">
      {icon && <div className="mb-2 text-2xl">{icon}</div>}

      {title && <p className="font-semibold text-slate-700">{title}</p>}

      <p className={title ? "mt-1" : ""}>{text}</p>
    </div>
  );
}
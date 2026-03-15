import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type BackLinkProps = {
  to: string;
  label?: string;
};

export default function BackLink({
  to,
  label = "Back",
}: BackLinkProps) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-rose-600"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-rose-100 bg-white shadow-sm">
        <ArrowLeft size={16} />
      </span>

      <span>{label}</span>
    </Link>
  );
}
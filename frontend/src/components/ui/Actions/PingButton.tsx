type PingButtonProps = {
  emoji: string;
  label: string;
  disabled?: boolean;
  onClick: () => void;
};

export default function PingButton({
  emoji,
  label,
  disabled = false,
  onClick,
}: PingButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="rounded-2xl border border-pink-200 bg-gradient-to-r from-rose-50 to-pink-50 px-5 py-4 text-left font-medium text-pink-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="text-lg">{emoji}</span>
      <span className="ml-2">{label}</span>
    </button>
  );
}
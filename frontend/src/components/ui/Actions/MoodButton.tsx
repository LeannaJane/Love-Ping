type MoodButtonProps = {
  emoji: string;
  label: string;
  disabled?: boolean;
  onClick: () => void;
};

export default function MoodButton({
  emoji,
  label,
  disabled = false,
  onClick,
}: MoodButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="rounded-2xl border border-pink-200 bg-rose-50 px-4 py-4 text-center transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <div className="text-2xl">{emoji}</div>
      <div className="mt-2 text-sm font-medium">{label}</div>
    </button>
  );
}
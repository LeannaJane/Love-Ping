type PromptCardProps = {
  label: string;
  prompt: string;
};

export default function PromptCard({ label, prompt }: PromptCardProps) {
  return (
    <div className="mt-6 rounded-3xl bg-gradient-to-br from-pink-100 to-rose-100 p-6">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-lg font-semibold text-pink-700">{prompt}</p>
    </div>
  );
}
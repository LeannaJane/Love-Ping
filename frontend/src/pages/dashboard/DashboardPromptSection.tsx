import DashboardCard from "../../components/ui/Dashboard/DashboardCard";
import PromptCard from "../../components/ui/Actions/PromptCard";

interface DashboardPromptSectionProps {
  todayPrompt: string;
}

export default function DashboardPromptSection({ todayPrompt }: DashboardPromptSectionProps) {
  return (
    <DashboardCard>
      <h2 className="text-2xl font-bold text-slate-800">Daily Love Prompt</h2>
      <p className="mt-2 text-slate-500">A small question to grow your connection.</p>
      <PromptCard label="Today’s prompt" prompt={todayPrompt} />
    </DashboardCard>
  );
}

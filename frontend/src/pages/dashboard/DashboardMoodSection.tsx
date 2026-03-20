import DashboardCard from "../../components/ui/Dashboard/DashboardCard";
import SectionHeader from "../../components/ui/Info/SectionHeader";
import EmptyState from "../../components/ui/Feedback/EmptyState";
import MoodButton from "../../components/ui/Actions/MoodButton";
import InfoBlock from "../../components/ui/Info/InfoBlock";

interface Mood {
  emoji: string;
  label: string;
  value: string;
}

interface DashboardMoodSectionProps {
  isConnected: boolean;
  moods: Mood[];
  savingMood: string | null;
  handleMoodClick: (mood: Mood) => void;
  currentMood: string | null;
}

export default function DashboardMoodSection({
  isConnected,
  moods,
  savingMood,
  handleMoodClick,
  currentMood,
}: DashboardMoodSectionProps) {
  return (
    <DashboardCard>
      <SectionHeader
        title="Mood Check-In"
        subtitle="Let your partner know how your heart feels today."
        icon="🥰"
      />
      {!isConnected ? (
        <div className="mt-6">
          <EmptyState text="Connect with your partner first to share moods." />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {moods.map((mood) => (
            <MoodButton
              key={mood.value}
              emoji={mood.emoji}
              label={mood.label}
              disabled={savingMood === mood.value}
              onClick={() => handleMoodClick(mood)}
            />
          ))}
        </div>
      )}
      <InfoBlock
        label="Current mood"
        value={currentMood || "No mood selected yet"}
        className="mt-5 bg-rose-50"
        valueClassName="text-rose-500"
      />
    </DashboardCard>
  );
}

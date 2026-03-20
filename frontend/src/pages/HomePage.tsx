import CTASection from "../components/landing/CTASection";
import FeaturesSection from "../components/landing/FeaturesSection";
import HeroSection from "../components/landing/HeroSection";
import Information from "../components/landing/Information";
import LandingHeader from "../components/landing/LandingHeader";

export default function LovePingHomePage() {
  const features = [
    {
      title: "Daily Love Pings",
      text: "Send quick check-ins, little notes, and reminders that make your partner feel seen every day.",
      icon: "💌",
    },
    {
      title: "Shared Mood Tracking",
      text: "See how you’re both feeling at a glance and notice patterns over time without making it complicated.",
      icon: "💗",
    },
    {
      title: "Private Couple Space",
      text: "Keep your moments, messages, and memories together in one calm, personal space.",
      icon: "✨",
    },
  ];

  const steps = [
    "Create your account",
    "Connect with your partner using an invite code",
    "Start sending daily pings and tracking your connection",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-pink-50 text-slate-800">
      <LandingHeader />
      <main>
        <HeroSection />
        <FeaturesSection features={features} />
        <Information steps={steps} />
        <CTASection />
      </main>
    </div>
  );
}
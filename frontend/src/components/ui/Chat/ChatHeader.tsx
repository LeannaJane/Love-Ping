type ChatHeaderProps = {
  count: number;
};

export default function ChatHeader({ count }: ChatHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 backdrop-blur">
      <div>
        <p className="text-sm font-semibold text-pink-600">Love Chat</p>
        <p className="text-xs text-slate-500">
          Pings and mood updates in one place
        </p>
      </div>

      <div className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-600">
        {count} messages
      </div>
    </div>
  );
}
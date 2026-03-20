type ChatBubbleProps = {
  type: "ping" | "mood";
  text: string;
  createdAt: string;
  isMine: boolean;
};

function formatTime(value: string) {
  const date = new Date(value);
  return date.toLocaleString("en-GB", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ChatBubble({
  type,
  text,
  createdAt,
  isMine,
}: ChatBubbleProps) {
  const bubbleStyles = isMine
    ? "ml-auto bg-gradient-to-r from-pink-500 to-rose-500 text-white"
    : type === "mood"
      ? "mr-auto border border-pink-100 bg-white text-slate-700"
      : "mr-auto bg-rose-100 text-rose-700";

  const labelStyles = isMine
    ? "bg-white/20 text-white"
    : type === "mood"
      ? "bg-pink-100 text-pink-600"
      : "bg-white/70 text-rose-600";

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[85%]">
        <div className={`rounded-[1.5rem] px-4 py-3 shadow-sm ${bubbleStyles}`}>
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${labelStyles}`}
            >
              {type}
            </span>
          </div>

          {type === "mood" ? (
            <div className="flex items-center gap-2">
              <span className="text-lg">💖</span>
              <p className="text-sm font-semibold">{text}</p>
            </div>
          ) : (
            <p className="text-sm leading-6">{text}</p>
          )}
        </div>

        <p
          className={`mt-2 text-xs text-slate-400 ${
            isMine ? "text-right" : "text-left"
          }`}
        >
          {formatTime(createdAt)}
        </p>
      </div>
    </div>
  );
}
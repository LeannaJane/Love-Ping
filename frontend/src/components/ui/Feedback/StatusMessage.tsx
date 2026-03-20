type StatusMessageProps = {
  message: string;
  tone: "success" | "error";
};

export default function StatusMessage({
  message,
  tone,
}: StatusMessageProps) {
  const toneClass = tone === "success" ? "text-green-600" : "text-red-500";

  return <p className={`mt-3 text-sm ${toneClass}`}>{message}</p>;
}
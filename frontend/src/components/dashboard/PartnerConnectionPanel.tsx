import type { DashboardData } from "../../services/dashboard";
import DashboardCard from "../ui/Dashboard/DashboardCard";
import StatusMessage from "../ui/Feedback/StatusMessage";
import InfoBlock from "../ui/Info/InfoBlock";

type PartnerConnectionPanelProps = {
  dashboard: DashboardData;
  inviteCodeInput: string;
  connecting: boolean;
  connectError: string;
  connectMessage: string;
  unlinking: boolean;
  unlinkError: string;
  unlinkMessage: string;
  onInviteCodeChange: (value: string) => void;
  onConnect: () => void;
  onUnlink: () => void;
};

export default function PartnerConnectionPanel({
  dashboard,
  inviteCodeInput,
  connecting,
  connectError,
  connectMessage,
  unlinking,
  unlinkError,
  unlinkMessage,
  onInviteCodeChange,
  onConnect,
  onUnlink,
}: PartnerConnectionPanelProps) {
  const isConnected = Boolean(dashboard.partner);

  return (
    <DashboardCard>
      {!isConnected ? (
        <>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-400">
            Your invite code
          </p>

          <div className="mt-5 rounded-3xl bg-gradient-to-r from-pink-500 via-rose-400 to-fuchsia-500 p-[1px]">
            <div className="rounded-3xl bg-white px-6 py-8 text-center">
              <p className="text-3xl font-extrabold tracking-[0.35em] text-pink-600 sm:text-4xl">
                {dashboard.invite_code}
              </p>
              <p className="mt-3 text-sm text-slate-500">
                Share this with your partner to connect.
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-400">
            Connected partner
          </p>

          <div className="mt-5 mb-2 rounded-3xl bg-gradient-to-r from-pink-500 via-rose-400 to-fuchsia-500 p-[2px]">
            <div className="rounded-3xl bg-white px-6 py-6">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-2xl">
                  💞
                </div>

                <div>
                  <p className="text-lg font-bold text-pink-600">
                    {dashboard.partner?.display_name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {dashboard.partner?.email}
                  </p>
                </div>
              </div>

              <p className="mt-4 mb-2 text-sm text-slate-500">
                You’re linked and ready to send pings and moods.
              </p>
            </div>
          </div>
        </>
      )}

      <InfoBlock
        label="Signed in as"
        value={dashboard.email}
        className="mt-6 bg-pink-50"
      />

      <div className="mt-6 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 p-5">
        <p className="text-sm font-medium text-slate-500">Partner</p>

        {dashboard.partner ? (
          <div className="mt-3 space-y-3">
            <div>
              <p className="text-lg font-semibold text-pink-600">
                {dashboard.partner.display_name}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {dashboard.partner.email}
              </p>
            </div>

            <button
              type="button"
              onClick={onUnlink}
              disabled={unlinking}
              className="w-full rounded-xl border border-rose-200 bg-white px-4 py-3 font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {unlinking ? "Unlinking..." : "Unlink partner"}
            </button>
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            <p className="text-sm text-slate-500">
              Enter your partner’s invite code to connect.
            </p>

            <input
              type="text"
              value={inviteCodeInput}
              onChange={(e) => onInviteCodeChange(e.target.value.toUpperCase())}
              placeholder="e.g. UF50TBRU"
              className="w-full rounded-xl border border-pink-200 px-4 py-3 text-slate-800 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />

            <button
              type="button"
              onClick={onConnect}
              disabled={connecting}
              className="w-full rounded-xl bg-pink-500 px-4 py-3 font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {connecting ? "Connecting..." : "Connect"}
            </button>
          </div>
        )}

        {connectMessage && (
          <StatusMessage message={connectMessage} tone="success" />
        )}
        {connectError && <StatusMessage message={connectError} tone="error" />}
        {unlinkMessage && (
          <StatusMessage message={unlinkMessage} tone="success" />
        )}
        {unlinkError && <StatusMessage message={unlinkError} tone="error" />}
      </div>
    </DashboardCard>
  );
}
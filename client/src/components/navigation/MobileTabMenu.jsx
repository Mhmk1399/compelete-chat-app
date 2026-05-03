import { Chat, Megaphone, Settings, Users } from "../../icons/lucide.js";

export default function MobileTabMenu({
  hidden,
  mobileTab,
  onChats,
  onGroups,
  onChannels,
  onSettings,
}) {
  const tabs = [
    { id: "chats",    icon: <Chat size={18} />,     onClick: onChats },
    { id: "groups",   icon: <Users size={18} />,    onClick: onGroups },
    { id: "channels", icon: <Megaphone size={18} />, onClick: onChannels },
    { id: "settings", icon: <Settings size={18} className="icon-anim-spin-dir" />, onClick: onSettings },
  ];

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-10 px-4 sm:px-6 md:hidden ${
        hidden ? "hidden" : ""
      }`}
      style={{
        paddingBottom:
          "max(0.5rem, calc(env(safe-area-inset-bottom) + var(--vv-bottom-offset, 0px) + 0.5rem))",
      }}
    >
      <div className="mx-auto mb-2 flex max-w-sm items-center justify-between rounded-3xl border border-slate-300/90 bg-white/95 px-2 py-1.5 shadow-lg shadow-emerald-500/10 backdrop-blur-none dark:border-emerald-500/35 dark:bg-slate-900/95 md:backdrop-blur">
        {tabs.map(({ id, icon, onClick }) => (
          <button
            key={id}
            type="button"
            onClick={onClick}
            className={`relative flex flex-1 items-center justify-center rounded-2xl p-2.5 transition ${
              mobileTab === id
                ? "text-white"
                : "text-emerald-700 dark:text-emerald-200"
            }`}
          >
            {mobileTab === id ? (
              <span className="absolute inset-0 rounded-2xl bg-emerald-500" />
            ) : null}
            <span className="relative z-10">{icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
}


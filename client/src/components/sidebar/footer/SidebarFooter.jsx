import Avatar from "../../common/Avatar.jsx";
import { hasPersian } from "../../../utils/fontUtils.js";

export default function SidebarFooter({
  user,
  displayName,
  displayInitials,
  statusDotClass,
  statusValue,
  userColor,
  onOpenOwnProfile,
}) {
  return (
    <div className="hidden h-[88px] border-t border-slate-300/80 bg-white px-6 py-4 dark:border-emerald-500/20 dark:bg-slate-900 md:absolute md:bottom-0 md:left-0 md:right-0 md:block">
      <div className="flex h-full items-center">
        <button
          type="button"
          onClick={onOpenOwnProfile}
          className="group flex items-center gap-3 text-left"
        >
          <Avatar
            src={user.avatarUrl}
            alt={displayName}
            name={displayName}
            color={userColor}
            initials={displayInitials}
            className="h-10 w-10 transition group-hover:ring-2 group-hover:ring-emerald-300"
          />
          <div className="min-w-0">
            <p
              className={`truncate text-sm font-semibold text-emerald-700 transition group-hover:text-emerald-600 dark:text-emerald-200 dark:group-hover:text-emerald-300 ${hasPersian(displayName) ? "font-fa" : ""}`}
              dir="auto"
              style={{ unicodeBidi: "plaintext" }}
              title={displayName}
            >
              {displayName}
            </p>
            <p className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className={`h-2 w-2 rounded-full ${statusDotClass}`} />
              {statusValue}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

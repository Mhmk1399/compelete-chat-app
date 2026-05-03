/**
 * NavRail — Telegram-style vertical icon rail, desktop-only (hidden on mobile).
 * Sits at the far-left edge of the screen, 68 px wide.
 */

import {
  Bell,
  Bookmark,
  Chat,
  Database,
  LogOut,
  Megaphone,
  Moon,
  Phone,
  ShieldCheck,
  Sun,
  Users,
  Video,
} from "../../icons/lucide.js";
import Avatar from "../common/Avatar.jsx";

function NavItem({ icon, label, active, onClick, buttonRef, danger }) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`group relative flex flex-col items-center gap-1 rounded-2xl px-1 py-2 w-full transition-colors ${
        danger
          ? "text-rose-400 hover:text-rose-300"
          : active
          ? "text-emerald-300"
          : "text-slate-400 hover:text-emerald-300"
      }`}
    >
      {active && (
        <span className="absolute inset-0 rounded-2xl bg-emerald-500/20 ring-1 ring-emerald-500/40" />
      )}
      <span className="relative z-10">{icon}</span>
      <span className={`relative z-10 text-[9px] font-semibold tracking-wide leading-none`}>
        {label}
      </span>
    </button>
  );
}

export default function NavRail({
  user,
  displayInitials,
  userColor,
  isDark,
  toggleTheme,
  isSavedChatActive,
  settingsPanel,
  showSettings,
  chatTypeFilter,
  onOpenChats,
  onOpenGroups,
  onOpenChannels,
  onOpenSavedMessages,
  onOpenProfile,
  onOpenSecurity,
  onOpenData,
  onOpenNotifications,
  onPeerCall,
  onGroupCall,
  onLogout,
  settingsButtonRef,
}) {
  const chatsActive =
    !showSettings && !settingsPanel && !isSavedChatActive && !chatTypeFilter;
  const groupsActive = !showSettings && !settingsPanel && chatTypeFilter === "group";
  const channelsActive = !showSettings && !settingsPanel && chatTypeFilter === "channel";
  const savedActive = isSavedChatActive;
  const securityActive = settingsPanel === "security";
  const dataActive = settingsPanel === "data";

  return (
    <aside className="hidden md:flex flex-col items-center w-[68px] shrink-0 h-full border-r border-white/5 bg-slate-950 py-3 gap-0.5 z-20 overflow-y-auto app-scroll">
      {/* Avatar — click to edit profile */}
      <button
        type="button"
        onClick={onOpenProfile}
        title="Edit profile"
        aria-label="Edit profile"
        className="mb-2 rounded-full ring-2 ring-transparent hover:ring-emerald-500/50 transition-all"
      >
        <Avatar
          src={user?.avatarUrl}
          alt={displayInitials}
          name={displayInitials}
          color={userColor}
          initials={displayInitials}
          className="h-10 w-10"
        />
      </button>

      <div className="w-8 border-t border-white/10 my-1" />

      {/* Chats */}
      <NavItem
        icon={<Chat size={20} />}
        label="Chats"
        active={chatsActive}
        onClick={onOpenChats}
      />

      {/* Groups */}
      <NavItem
        icon={<Users size={20} />}
        label="Groups"
        active={groupsActive}
        onClick={onOpenGroups}
      />

      {/* Channels */}
      <NavItem
        icon={<Megaphone size={20} />}
        label="Channels"
        active={channelsActive}
        onClick={onOpenChannels}
      />

      {/* P2P Call */}
      <NavItem
        icon={<Phone size={20} />}
        label="Call"
        active={false}
        onClick={onPeerCall}
      />

      {/* Group Call */}
      <NavItem
        icon={<Video size={20} />}
        label="Group Call"
        active={false}
        onClick={onGroupCall}
      />

      {/* Saved Messages */}
      <NavItem
        icon={<Bookmark size={20} />}
        label="Saved"
        active={savedActive}
        onClick={onOpenSavedMessages}
      />

      <div className="w-8 border-t border-white/10 my-1" />

      {/* Notifications */}
      <NavItem
        icon={<Bell size={20} />}
        label="Alerts"
        active={false}
        onClick={onOpenNotifications}
      />

      {/* Security */}
      <NavItem
        icon={<ShieldCheck size={20} />}
        label="Security"
        active={securityActive}
        onClick={onOpenSecurity}
      />

      {/* Data */}
      <NavItem
        icon={<Database size={20} />}
        label="Data"
        active={dataActive}
        onClick={onOpenData}
      />

      {/* Spacer */}
      <div className="flex-1" />

      <div className="w-8 border-t border-white/10 my-1" />

      {/* Theme toggle */}
      <button
        type="button"
        onClick={toggleTheme}
        title={isDark ? "Light mode" : "Dark mode"}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className="flex flex-col items-center gap-1 rounded-2xl px-1 py-2 w-full text-slate-400 transition-colors hover:text-emerald-300"
      >
        <span>{isDark ? <Sun size={20} /> : <Moon size={20} />}</span>
        <span className="text-[9px] font-semibold tracking-wide leading-none">
          {isDark ? "Light" : "Dark"}
        </span>
      </button>

      {/* Logout */}
      <NavItem
        icon={<LogOut size={20} />}
        label="Logout"
        active={false}
        danger
        onClick={onLogout}
      />
    </aside>
  );
}

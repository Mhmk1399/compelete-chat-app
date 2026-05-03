import { Moon, Sun } from "../../icons/lucide.js";

export default function AuthHeader({
  isDark,
  themeToggleAnimating,
  onToggleTheme,
}) {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={onToggleTheme}
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-white/80 text-emerald-700 transition dark:border-emerald-500/30 dark:bg-slate-950 dark:text-emerald-200"
        aria-label="Toggle dark mode"
      >
        {isDark ? (
          <Sun
            key="theme-sun"
            size={16}
            className={`icon-anim-spin-dir ${themeToggleAnimating ? "icon-theme-enter-sun" : ""}`}
          />
        ) : (
          <Moon
            key="theme-moon"
            size={16}
            className={`icon-anim-spin-left ${themeToggleAnimating ? "icon-theme-enter-moon" : ""}`}
          />
        )}
      </button>
    </div>
  );
}

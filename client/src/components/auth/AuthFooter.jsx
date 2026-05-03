export default function AuthFooter({ isLogin, canSignup, onSwitchMode }) {
  if (!canSignup) return null;

  return (
    <div className="mt-5 flex justify-center">
      <div className="flex rounded-2xl border border-emerald-200 bg-emerald-50/60 p-1 dark:border-emerald-500/30 dark:bg-slate-900/60">
        <button
          type="button"
          onClick={isLogin ? undefined : onSwitchMode}
          className={`rounded-xl px-4 py-1.5 text-xs font-semibold transition ${
            isLogin
              ? "bg-white text-emerald-700 shadow-sm dark:bg-slate-800 dark:text-emerald-200"
              : "text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-300"
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={!isLogin ? undefined : onSwitchMode}
          className={`rounded-xl px-4 py-1.5 text-xs font-semibold transition ${
            !isLogin
              ? "bg-white text-emerald-700 shadow-sm dark:bg-slate-800 dark:text-emerald-200"
              : "text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-300"
          }`}
        >
          Sign up
        </button>
      </div>
    </div>
  );
}

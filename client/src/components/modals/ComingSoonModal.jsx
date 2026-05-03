import { createPortal } from "react-dom";
import { Phone } from "../../icons/lucide.js";

export default function ComingSoonModal({ open, onClose }) {
  if (!open) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[320] flex items-center justify-center bg-black/40 px-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-emerald-100/70 bg-white p-6 shadow-xl dark:border-emerald-500/30 dark:bg-slate-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20">
            <Phone size={22} />
          </span>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
            Coming Soon
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Calling is currently in development and will be available in a
            future release.
          </p>
        </div>
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(0,218,253,0.4)]"
          >
            Got it
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

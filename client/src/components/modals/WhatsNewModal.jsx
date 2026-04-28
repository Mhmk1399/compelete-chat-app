import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Close } from "../../icons/lucide.js";
import { copyTextToClipboard } from "../../utils/clipboard.js";
import { renderMarkdownBlock } from "../../utils/markdown.js";

function normalizeVersionLabel(value) {
  return String(value || "")
    .trim()
    .replace(/^v/i, "");
}

function getSections(changelogSections, version, changelog) {
  if (Array.isArray(changelogSections) && changelogSections.length) {
    const normalizedCurrentVersion = normalizeVersionLabel(version);
    const mappedSections = changelogSections
      .map((section) => ({
        heading: String(section?.heading || "").trim(),
        body: String(section?.body || "").trim(),
      }))
      .filter((section) => section.heading || section.body);
    const currentIndex = mappedSections.findIndex(
      (section) =>
        normalizeVersionLabel(section.heading) === normalizedCurrentVersion,
    );

    if (currentIndex > 0) {
      return [
        mappedSections[currentIndex],
        ...mappedSections.slice(0, currentIndex),
        ...mappedSections.slice(currentIndex + 1),
      ];
    }

    return mappedSections;
  }

  const body = String(changelog || "").trim();
  if (!body) return [];
  return [
    {
      heading: String(version || "").trim(),
      body,
    },
  ];
}

export default function WhatsNewModal({
  open,
  version,
  changelog,
  changelogSections,
  onClose,
}) {
  const panelRef = useRef(null);
  const contentRef = useRef(null);
  const sections = useMemo(
    () => getSections(changelogSections, version, changelog),
    [changelogSections, version, changelog],
  );
  const [pageIndex, setPageIndex] = useState(0);
  const activeSection = sections[pageIndex] || null;
  const markdownHtml = useMemo(
    () => renderMarkdownBlock(activeSection?.body || ""),
    [activeSection?.body],
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const rafId = window.requestAnimationFrame(() => {
      setPageIndex(0);
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [open, version, changelog, changelogSections]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus?.();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const container = contentRef.current;
    if (!container) return undefined;

    const resolveTargetElement = (target) => {
      if (!target) return null;
      if (target instanceof Element) return target;
      return target.parentElement instanceof Element
        ? target.parentElement
        : null;
    };
    const resetCodeButtonState = (button, state, label) => {
      if (!button) return;
      button.dataset.state = state;
      button.setAttribute("aria-label", label);
    };
    const resetInlineCodeState = (codeEl, state, label) => {
      if (!codeEl) return;
      codeEl.dataset.copyState = state;
      codeEl.setAttribute("aria-label", label);
    };
    const enhanceCodeElements = () => {
      const blocks = container.querySelectorAll(".sb-code-block");
      blocks.forEach((block) => {
        if (block.dataset.sbEnhanced === "1") return;
        block.dataset.sbEnhanced = "1";
      });
      const inlineCodes = container.querySelectorAll("code");
      inlineCodes.forEach((codeEl) => {
        if (codeEl.closest("pre")) return;
        if (codeEl.dataset.sbEnhanced === "1") return;
        codeEl.dataset.sbEnhanced = "1";
        codeEl.tabIndex = 0;
        codeEl.setAttribute("role", "button");
        codeEl.setAttribute("aria-label", "Copy inline code");
        codeEl.classList.add("sb-inline-code-copyable");
      });
    };
    const handleCodeCopy = async ({ codeEl, button }) => {
      if (!codeEl) return;
      const copied = await copyTextToClipboard(codeEl.textContent || "");
      if (button) {
        if (copied) {
          resetCodeButtonState(button, "copied", "Copied");
        } else {
          resetCodeButtonState(button, "error", "Copy failed");
        }
      } else {
        resetInlineCodeState(
          codeEl,
          copied ? "copied" : "error",
          copied ? "Copied inline code" : "Inline code copy failed",
        );
      }
      window.setTimeout(() => {
        if (button) {
          resetCodeButtonState(button, "idle", "Copy code");
        } else {
          resetInlineCodeState(codeEl, "idle", "Copy inline code");
        }
      }, 1200);
    };
    const handleCodeBlockClick = (event) => {
      const target = resolveTargetElement(event?.target);
      if (!target || typeof target.closest !== "function") return;
      const button = target.closest(".sb-code-copy");
      const inlineCode = target.closest(".sb-inline-code-copyable");
      if (inlineCode && container.contains(inlineCode)) {
        event.preventDefault();
        void handleCodeCopy({ codeEl: inlineCode, button: null });
        return;
      }
      const block = button?.closest(".sb-code-block");
      if (!button || !block || !container.contains(block)) return;
      event.preventDefault();
      event.stopPropagation();
      void handleCodeCopy({
        codeEl: block.querySelector("pre.sb-code > code"),
        button,
      });
    };
    const handleCodeBlockKeyDown = (event) => {
      const target = resolveTargetElement(event?.target);
      if (!target || typeof target.closest !== "function") return;
      const inlineCode = target.closest(".sb-inline-code-copyable");
      if (inlineCode && container.contains(inlineCode)) {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        void handleCodeCopy({ codeEl: inlineCode, button: null });
        return;
      }
      const button = target.closest(".sb-code-copy");
      const block = button?.closest(".sb-code-block");
      if (!button || !block || !container.contains(block)) return;
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      void handleCodeCopy({
        codeEl: block.querySelector("pre.sb-code > code"),
        button,
      });
    };

    enhanceCodeElements();
    let idleId = null;
    let timerId = null;
    if (
      typeof window !== "undefined" &&
      typeof window.requestIdleCallback === "function"
    ) {
      idleId = window.requestIdleCallback(enhanceCodeElements, {
        timeout: 600,
      });
    } else {
      timerId = window.setTimeout(enhanceCodeElements, 40);
    }
    container.addEventListener("click", handleCodeBlockClick);
    container.addEventListener("keydown", handleCodeBlockKeyDown);

    return () => {
      container.removeEventListener("click", handleCodeBlockClick);
      container.removeEventListener("keydown", handleCodeBlockKeyDown);
      if (
        idleId !== null &&
        typeof window !== "undefined" &&
        typeof window.cancelIdleCallback === "function"
      ) {
        window.cancelIdleCallback(idleId);
      }
      if (timerId !== null && typeof window !== "undefined") {
        window.clearTimeout(timerId);
      }
    };
  }, [markdownHtml, open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[160] flex items-center justify-center bg-slate-950/60 px-4 py-6"
      onClick={() => onClose?.()}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="flex max-h-[min(88vh,52rem)] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-emerald-100/70 bg-white shadow-2xl outline-none dark:border-emerald-500/30 dark:bg-slate-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-emerald-100/70 px-6 py-5 dark:border-emerald-500/20">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-emerald-500/80">
              What's New
            </p>
            <h3 className="mt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-200">
              Cheetah Chat {activeSection?.heading || version || ""}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onClose?.()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-600 transition hover:border-rose-300 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
            aria-label="Close what's new"
          >
            <Close size={18} />
          </button>
        </div>

        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto px-6 py-6 space-y-6 app-scroll"
        >
          {/* Changelog content */}
          


         

          {/* Customization pitch */}
          <div className="rounded-2xl border border-brand-500/20 bg-brand-500/5 p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-brand-400" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-400">
                Tailored for Your Business
              </p>
            </div>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              Cheetah Chat is a{" "}
              <span className="font-semibold text-brand-400">
                fully customizable
              </span>{" "}
              private chat platform that can be specialized for any company. Whether
              you need a branded internal messenger, a customer support hub, or a
              secure team collaboration tool — every aspect can be tailored:
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
              {[
                "Custom branding — logo, colors, fonts",
                "Role-based access, team channels & DMs",
                "File sharing, voice messages & media",
                "Push notifications & PWA support",
                "On-premise deployment — your data, your servers",
                "API integrations with your existing tools",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400/70" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="https://cheetahnova.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-400"
            >
              Get a custom build →
            </a>
          </div>
           {/* About Cheetah Nova */}
          <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/40 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/5">
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-600 dark:text-emerald-400">
                Built by Cheetah Nova
              </p>
            </div>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              Dynamic Senior Developers with over six years of robust experience in web
              development and business analysis — elevating over{" "}
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                100 companies
              </span>{" "}
              into the digital realm. Expertise in crafting user-friendly and practical
              websites, complemented by a strong foundation in data analysis, UX design,
              and full-stack development. Committed to automating processes and optimizing
              user interactions, consistently delivering innovative solutions that drive
              success.
            </p>
            <a
              href="https://cheetahnova.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition hover:text-emerald-400 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              cheetahnova.com
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </div>,
    document.body,
  );
}

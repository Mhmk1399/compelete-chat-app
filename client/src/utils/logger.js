/**
 * client/src/utils/logger.js
 * Lightweight leveled logger for the Cheetah Chat frontend.
 *
 * ── Levels ──────────────────────────────────────────────────────────────────
 *   debug  — verbose tracing; only active when VITE_DEBUG=true
 *   info   — notable lifecycle events (component mount, fetch success)
 *   warn   — recoverable issues (cache miss, retry, deprecated usage)
 *   error  — caught errors that affect the user
 *
 * ── Usage ────────────────────────────────────────────────────────────────────
 *   import { createLogger } from '../utils/logger'
 *
 *   // At the top of a component or hook:
 *   const log = createLogger('ChatPage')
 *
 *   log.debug('messages loaded', { count: messages.length })
 *   log.info('connected to SSE')
 *   log.warn('cache miss', { chatId })
 *   log.error('failed to send', error)
 *
 * ── Colour key (dev console) ─────────────────────────────────────────────────
 *   🔵 debug  — #00dafd  (brand cyan)
 *   🟢 info   — #22c55e  (green)
 *   🟡 warn   — #f59e0b  (amber)
 *   🔴 error  — #ef4444  (red)
 */

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };

const STYLES = {
  debug: 'color:#00dafd;font-weight:600',
  info:  'color:#22c55e;font-weight:600',
  warn:  'color:#f59e0b;font-weight:600',
  error: 'color:#ef4444;font-weight:600',
};

const isDebug = import.meta.env.VITE_DEBUG === 'true';
const isDev   = import.meta.env.DEV;

// In production builds, only warn + error are emitted.
// In dev, all levels are shown (or debug too when VITE_DEBUG=true).
const activeLevel = isDebug ? LEVELS.debug
  : isDev             ? LEVELS.info
  :                     LEVELS.warn;

/**
 * Returns a namespaced logger instance tagged with [namespace].
 * @param {string} namespace - e.g. 'ChatPage', 'useChatEvents', 'chatApi'
 */
export function createLogger(namespace) {
  const tag = `%c[${namespace}]`;

  function emit(level, message, ...data) {
    if (LEVELS[level] < activeLevel) return;
    const style = STYLES[level];
    const timestamp = new Date().toTimeString().slice(0, 8);
    const prefix = `${timestamp} ${tag}`;

    if (data.length) {
      console[level === 'debug' ? 'log' : level](prefix, style, message, ...data);
    } else {
      console[level === 'debug' ? 'log' : level](prefix, style, message);
    }
  }

  return {
    debug: (msg, ...data) => emit('debug', msg, ...data),
    info:  (msg, ...data) => emit('info',  msg, ...data),
    warn:  (msg, ...data) => emit('warn',  msg, ...data),
    error: (msg, ...data) => emit('error', msg, ...data),
  };
}

// A default app-level logger for quick usage without a namespace
export default createLogger('app');

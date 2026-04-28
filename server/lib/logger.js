/**
 * server/lib/logger.js
 * Centralised Winston logger for the Cheetah Chat server.
 *
 * Log levels (most → least verbose):
 *   debug  — fine-grained internal events (only when APP_DEBUG=true)
 *   info   — normal operational messages (startup, connections)
 *   warn   — recoverable issues (rate limits, missing optional config)
 *   error  — failures that need attention
 *
 * Usage:
 *   import logger from './lib/logger.js'
 *   logger.info('Server started', { port: 3000 })
 *   logger.debug('Query result', { rows: 42 })
 *   logger.warn('Rate limit hit', { ip: '1.2.3.4' })
 *   logger.error('Unhandled error', { err: error.message })
 */

import winston from 'winston';

const { combine, timestamp, colorize, printf, json, errors } = winston.format;

const isProduction = (process.env.APP_ENV || 'production') === 'production';
const isDebug      = process.env.APP_DEBUG === 'true' || process.env.APP_DEBUG === '1';

// ── Pretty format for development terminals ─────────────────────────────────
const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length
      ? ' ' + JSON.stringify(meta, null, 0)
      : '';
    return `${timestamp} ${level}: ${stack || message}${metaStr}`;
  }),
);

// ── Structured JSON format for production / log-aggregation tools ────────────
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json(),
);

const logger = winston.createLogger({
  level: isDebug ? 'debug' : 'info',
  format: isProduction ? prodFormat : devFormat,
  transports: [
    new winston.transports.Console(),
  ],
});

// ── Morgan stream — pipes HTTP logs through Winston ──────────────────────────
logger.morganStream = {
  write(message) {
    // Morgan appends a newline — trim it
    logger.http(message.trim());
  },
};

// Ensure `http` level exists (between verbose and debug for HTTP access logs)
if (!winston.config.npm.levels.http) {
  logger.add(new winston.transports.Console({ level: 'http' }));
}

export default logger;

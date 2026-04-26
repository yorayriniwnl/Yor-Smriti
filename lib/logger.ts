/**
 * Structured logger.
 *
 * In production (or when LOG_JSON=1 is set) every log line is a single JSON
 * object on stdout/stderr. Vercel's log drain ingests these as structured
 * records, making them searchable and filterable by level, message, and any
 * extra fields.
 *
 * In development the output stays human-readable unless LOG_JSON=1 is set.
 *
 * Log level is controlled by the LOG_LEVEL env var (error|warn|info|debug).
 * Defaults to "info" in production and "debug" in development.
 *
 * Usage:
 *   logger.info('[auth] session created', { username });
 *   logger.error('[db] query failed', err);
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn:  1,
  info:  2,
  debug: 3,
};

function getCurrentLevel(): LogLevel {
  const env = (
    process.env.LOG_LEVEL ??
    (process.env.NODE_ENV === 'production' ? 'info' : 'debug')
  ).toLowerCase();
  if (env === 'error' || env === 'warn' || env === 'info' || env === 'debug') {
    return env as LogLevel;
  }
  return 'info';
}

function shouldLog(level: LogLevel): boolean {
  return LEVELS[level] <= LEVELS[getCurrentLevel()];
}

/** True when running on Vercel or when the operator has opted in to JSON logs. */
function shouldUseJsonOutput(): boolean {
  return process.env.NODE_ENV === 'production' || process.env.LOG_JSON === '1';
}

/**
 * Serialize an arbitrary value to something safe to embed in a log record.
 * Errors are expanded so their message and stack survive JSON serialization.
 */
function serializeArg(arg: unknown): unknown {
  if (arg instanceof Error) {
    return { error: arg.name, message: arg.message, stack: arg.stack };
  }
  if (typeof arg === 'object' && arg !== null) return arg;
  return String(arg);
}

/**
 * Merge variadic args into a { msg, ...meta } shape.
 * The first string argument becomes `msg`; everything else goes into `meta`.
 */
function buildRecord(
  level: LogLevel,
  args: unknown[],
): Record<string, unknown> {
  const record: Record<string, unknown> = {
    level,
    time: new Date().toISOString(),
  };

  const [first, ...rest] = args;
  if (typeof first === 'string') {
    record.msg = first;
  } else {
    record.msg = '';
    rest.unshift(first);
  }

  if (rest.length === 1) {
    const only = rest[0];
    if (only instanceof Error) {
      Object.assign(record, serializeArg(only));
    } else if (typeof only === 'object' && only !== null) {
      Object.assign(record, only);
    } else {
      record.meta = serializeArg(only);
    }
  } else if (rest.length > 1) {
    record.meta = rest.map(serializeArg);
  }

  return record;
}

// ─── Console method mapping ───────────────────────────────────────────────────
// Vercel categorises log lines by the console method used, so we keep
// console.error for errors and console.warn for warnings even in JSON mode.
const CONSOLE_METHOD: Record<LogLevel, (...a: unknown[]) => void> = {
  error: console.error,
  warn:  console.warn,
  info:  console.log,   // console.info adds an 'ℹ' prefix in some runtimes
  debug: console.log,
};

function emit(level: LogLevel, args: unknown[]): void {
  if (!shouldLog(level)) return;

  const fn = CONSOLE_METHOD[level];

  if (shouldUseJsonOutput()) {
    fn(JSON.stringify(buildRecord(level, args)));
  } else {
    // Human-readable: [ISO] [LEVEL] ...args
    fn(`[${new Date().toISOString()}] [${level.toUpperCase()}]`, ...args);
  }
}

export const logger = {
  error: (...args: unknown[]) => emit('error', args),
  warn:  (...args: unknown[]) => emit('warn',  args),
  info:  (...args: unknown[]) => emit('info',  args),
  debug: (...args: unknown[]) => emit('debug', args),
};

export default logger;

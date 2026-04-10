type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

function getCurrentLevel(): LogLevel {
  const env = (process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug')).toLowerCase();
  if (env === 'error' || env === 'warn' || env === 'info' || env === 'debug') return env as LogLevel;
  return 'info';
}

function shouldLog(level: LogLevel) {
  const current = getCurrentLevel();
  return LEVELS[level] <= LEVELS[current];
}

function formatPrefix(level: LogLevel) {
  return `[${new Date().toISOString()}] [${level}]`;
}

export const logger = {
  error: (...args: unknown[]) => {
    if (!shouldLog('error')) return;
    // eslint-disable-next-line no-console
    console.error(formatPrefix('error'), ...args);
  },
  warn: (...args: unknown[]) => {
    if (!shouldLog('warn')) return;
    // eslint-disable-next-line no-console
    console.warn(formatPrefix('warn'), ...args);
  },
  info: (...args: unknown[]) => {
    if (!shouldLog('info')) return;
    // eslint-disable-next-line no-console
    console.info(formatPrefix('info'), ...args);
  },
  debug: (...args: unknown[]) => {
    if (!shouldLog('debug')) return;
    // eslint-disable-next-line no-console
    console.log(formatPrefix('debug'), ...args);
  },
};

export default logger;

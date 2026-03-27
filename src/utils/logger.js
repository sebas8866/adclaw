import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp, agent, swarmId, ...meta }) => {
  const prefix = [agent, swarmId].filter(Boolean).join('/');
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `${timestamp} [${level}]${prefix ? ` (${prefix})` : ''} ${message}${metaStr}`;
});

const logTransports = [
  new transports.Console({
    format: combine(colorize(), logFormat),
  }),
];

if (!process.env.VERCEL) {
  logTransports.push(
    new transports.File({
      filename: 'logs/adclaw.log',
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    }),
    new transports.File({
      filename: 'logs/errors.log',
      level: 'error',
    })
  );
}

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: logTransports,
});

export function agentLogger(agentName, swarmId) {
  return logger.child({ agent: agentName, swarmId });
}

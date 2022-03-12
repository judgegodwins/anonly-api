import { createLogger, format, transports } from 'winston';
import { consoleFormat } from 'winston-console-format';
import config, { AppEnvironmentEnum } from '../config';

const { TEST, LOCAL } = AppEnvironmentEnum;

const consoleTransportOptions = [TEST, LOCAL].includes(config.app.env)
  ? {
    handleExceptions: true,
    format: format.combine(
      format.colorize({ all: true }),
      format.padLevels(),
      consoleFormat({
        showMeta: true,
        inspectOptions: {
          depth: Infinity,
          colors: true,
          maxArrayLength: Infinity,
          breakLength: 120,
          compact: Infinity,
        },
      }),
    ),
  }
  : { handleExceptions: true };

const createComponentLogger = (component: string) => createLogger({
  level: 'debug',
  format: format.combine(format.timestamp({ format: () => new Date().toLocaleString() }), format.errors({ stack: true }), format.splat(), format.json()),
  defaultMeta: { component },
  transports: [new transports.Console(consoleTransportOptions)],
});

export const generalLogger = createComponentLogger('GENERAL');
export const routesLogger = createComponentLogger('ROUTES');
export const errorLogger = createComponentLogger('ERROR');
export const scriptLogger = createComponentLogger('SCRIPT');

export default generalLogger;

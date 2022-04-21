const winston = require('winston');
const als = require('async-local-storage');
const { format } = require('date-fns');
const config = require('config').get('logger');

const { getRandomString } = require('./cryptography');

const ALS_KEY = 'META';
const LEVELS = {
  emerg: 0, alert: 1, crit: 2, error: 3, warning: 4, notice: 5, info: 6, debug: 7,
};

als.enable();

const { format: { printf, combine, errors } } = winston;

const levelMap = {
  debug: '\x1b[94mDEBUG\x1b[0m',
  info: '\x1b[32mINFO\x1b[0m',
  warn: '\x1b[33mWARN\x1b[0m',
  error: '\x1b[31mERROR\x1b[0m',
  crit: '\x1b[91mCRITICAL\x1b[0m',
};

const errorSerializer = (obj = {}) => {
  const result = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj) {
    if (obj[key] instanceof Error) {
      result[key] = {
        name: obj[key].name,
        message: obj[key].message,
        stack: obj[key].stack,
      };
    } else {
      result[key] = obj[key];
    }
  }
  return result;
};

const extractErrors = (obj) => Object.keys(obj).filter((key) => obj[key] instanceof Error)
  .map((errKey) => `\n${obj[errKey].stack}`)
  .join('\n');

const consoleView = printf((info) => {
  let meta = als.get(ALS_KEY);
  if (!meta) {
    meta = { requestId: getRandomString(17) };
    als.set(ALS_KEY, meta, false);
  }
  return `[\x1b[35m${format(new Date(), 'HH:mm:ss:SSS')}\x1b[0m][\x1b[93m${meta.requestId}\x1b[0m][${levelMap[info.level]}] \x1b[34m${info.message + extractErrors(info.data)} \x1b[90m/ ${JSON.stringify({
    ...info.data,
    ...info.meta,
    ...meta,
    requestId: undefined,
  })}\x1b[0m`;
});

const jsonView = printf((info) => {
  let meta = als.get(ALS_KEY);
  if (!meta) {
    meta = { requestId: getRandomString(17) };
    als.set(ALS_KEY, meta, false);
  }
  return JSON.stringify({
    '@timestamp': new Date().toISOString(),
    ...meta,
    ...{ ...info, meta: undefined, data: undefined },
    ...info.meta,
    ...errorSerializer(info.data),
  });
});

const container = new winston.Container({
  transports: [
    new winston.transports.Console(),
  ],
});

function setLogLevel(level) {
  // eslint-disable-next-line no-param-reassign,no-return-assign
  container.options.transports.forEach((transport) => transport.level = level);
}

// eslint-disable-next-line no-mixed-operators
const logFormat = config.get('json') === true && jsonView || consoleView;

class Logger {
  constructor(meta = { className: 'static' }) {
    this._logger = container.has(meta.className) && container.get(meta.className);
    if (!this._logger) {
      container.add(meta.className, {
        format: combine(
          errors({ stack: true }),
          logFormat,
        ),
        defaultMeta: { meta },
      });
      this._logger = container.get(meta.className);
    }
  }

  static child(meta) {
    return new Logger(meta);
  }

  getMeta() {
    return als.get(ALS_KEY) || {};
  }

  setMeta(data) {
    const meta = als.get(ALS_KEY) || {};
    als.set(ALS_KEY, { ...data, requestId: meta.requestId }, false);
  }

  addMeta(data) {
    const meta = als.get(ALS_KEY) || {};
    als.set(ALS_KEY, { ...meta, ...data }, false);
  }

  debug(meta = {}, message = '') {
    this._logger.debug(message, { data: meta });
  }

  info(meta = {}, message = '') {
    this._logger.info(message, { data: meta });
  }

  warn(meta = {}, message = '') {
    this._logger.warn(message, { data: meta });
  }

  error(meta = {}, message = '') {
    this._logger.error(message, { data: meta });
  }

  critical(meta = {}, message = '') {
    this._logger.crit(message, { data: meta });
  }
}

const log = Logger.child();
const logMiddleware = Logger.child({ zone: 'middleware', className: 'LoggingMiddleware' });

function middleware(req, res, next) {
  const requestId = req.headers['X-Request-Id'] || req.headers['x-request-id'] || getRandomString(15);
  logMiddleware.addMeta({ requestId });
  logMiddleware.info({
    url: req.url,
    method: req.method,
    cookies: req.cookies,
  }, 'INCOMING_REQUEST');
  next();
}

module.exports = {
  child: Logger.child,
  log,
  middleware,
  setLogLevel,
  LEVELS,
};

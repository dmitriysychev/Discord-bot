const Redis = require('ioredis');

const log = require('../../common/logger').child({ className: 'RedisConnection' });

const { RedisStorageError } = require('../../common/errors');
const errors = require('../../common/errorCodes');

class RedisConnection {
  constructor() {
    this._HOST = process.env.REDIS_HOST;
    this._PORT = process.env.REDIS_PORT;
    this._PASS = process.env.REDIS_PASS;
  }

  async init() {
    log.info({ methodName: 'init' }, 'Initializing Redis connection');
    try {
      return new Redis({
        host: this._HOST,
        port: this._PORT,
        password: this._PASS,
      });
    } catch (err) {
      throw new RedisStorageError(errors.REDIS_INIT_ERROR);
    }
  }
}

module.exports = RedisConnection;

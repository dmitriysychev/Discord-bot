const log = require('../common/logger').child({ className: 'QueueStorage' });

class QueueStorage {
  /**
   * @param {Array} queue - initial value of queue, [] by default.
   */
  constructor(redisConnection) {
    this._client = redisConnection;
    this._QUEUE_KEY = 'MUSIC_QUEUE';
  }

  async init() {
    log.info({ methodName: 'init' }, 'Initializing music queue...');
    this._client.init();
    log.info({ methodName: 'init' }, 'Music Queue initialized');
  }

  get length() {
    return this._queue.length;
  }

  async push(guildId, element) {
    await this._client.rpush(`${this._QUEUE_KEY}:${guildId}`, element); // [] => [1] => [1, 2] => [1, 2, 3]
  }

  async poll(guildId) {
    return this._client.lpop(`${this._QUEUE_KEY}:${guildId}`); // [1, 2, 3] => [2, 3] => [3] => []
  }

  async top(guildId) {
    return this._client.lrange(`${this._QUEUE_KEY}:${guildId}`, 0, 0); // [1, 2, 3] => 1
  }

  async isEmpty(guildId) {
    const length = await this._client.llen(guildId);
    return !length;
  }

  async clear(guildId) {
    await this._client.del(`${this._QUEUE_KEY}:${guildId}`);
  }

  async show(guildId) {
    return this._client.lrange(`${this._QUEUE_KEY}:${guildId}`, -1, 0);
  }
}

module.exports = QueueStorage;

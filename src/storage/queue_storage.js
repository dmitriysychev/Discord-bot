const log = require('../common/logger').child({ className: 'QueueStorage' });

class QueueStorage {
  /**
   * @param {RedisConnection} redisConnection - redis
   */
  constructor(redisConnection) {
    this._redis = redisConnection;
    this._client = null;
    this._QUEUE_KEY = 'MUSIC_QUEUE';
    this._PLAYING_KEY = 'QUEUE_STATE';
  }

  async init() {
    log.info({ methodName: 'init' }, 'Initializing music queue...');
    this._client = await this._redis.init();
    log.info({ methodName: 'init' }, 'Music Queue initialized');
  }

  async setPlaying(guildId, state) {
    log.info({}, `Set ${guildId} queue playing: ${state}`);
    await this._client.set(`${this._PLAYING_KEY}:${guildId}`, state);
  }

  async isPlaying(guildId) {
    const state = await this._client.get(`${this._PLAYING_KEY}:${guildId}`);
    log.info({}, `Queue ${guildId} now is playing: ${state}`);
    return state;
  }

  async length(guildId) {
    log.info({}, `Check queue length for ${guildId}`);
    return this._client.llen(`${this._QUEUE_KEY}:${guildId}`);
  }

  async push(guildId, element) {
    log.info({}, `Add ${element} to ${guildId} queue`);
    await this._client.rpush(`${this._QUEUE_KEY}:${guildId}`, element); // [] => [1] => [1, 2] => [1, 2, 3]
  }

  async poll(guildId) {
    log.info({}, `Poll element from ${guildId} queue`);
    const element = await this._client.lpop(`${this._QUEUE_KEY}:${guildId}`); // [1, 2, 3] => [2, 3] => [3] => []
    log.info({}, `Polled element: ${element}`);
    return element;
  }

  async top(guildId) {
    log.info({}, `Lookup ${guildId} queue`);
    const element = await this._client.lrange(`${this._QUEUE_KEY}:${guildId}`, 0, 0); // [1, 2, 3] => 1
    log.info({}, `Element on top: ${element}`);
    return element;
  }

  async isEmpty(guildId) {
    log.info({}, `Check ${guildId} queue is empty`);
    const length = await this._client.llen(`${this._QUEUE_KEY}:${guildId}`);
    log.info({}, `Queue length ${length}`);
    return !length;
  }

  /**
   * Cleat
   * @param {String} guildId
   * @returns {Promise<void>}
   */
  async clear(guildId) {
    log.info({}, `Clear ${guildId} queue`);
    await this._client.get(`${this._PLAYING_KEY}:${guildId}`);
    await this._client.del(`${this._QUEUE_KEY}:${guildId}`);
  }

  async show(guildId) {
    return this._client.lrange(`${this._QUEUE_KEY}:${guildId}`, -1, 0);
  }
}

module.exports = QueueStorage;

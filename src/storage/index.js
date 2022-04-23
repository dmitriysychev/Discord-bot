const log = require('../common/logger').child({ className: 'Storage' });

const Redis = require('./clients/redis');

const ConnectionsStorage = require('./connections_storage');
const QueueStorage = require('./queue_storage');

class Storage {
  constructor() {
    this._connectionsStorage = new ConnectionsStorage();
    this._queueStorage = new QueueStorage(new Redis());
  }

  async init() {
    log.info({ methodName: 'init' }, 'Initializing storages');
    await Promise.all([
      this._connectionsStorage.init(),
      this._queueStorage.init(),
    ]);
  }

  get connections() {
    return this._connectionsStorage;
  }

  get musicQueue() {
    return this._queueStorage;
  }
}

module.exports = new Storage();

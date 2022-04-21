const log = require('../common/logger').child({ className: 'ConnectionsStorage' });

class ConnectionsStorage {
  constructor() {
    this._store = new Map();
  }

  async init() {
    log.info({ methodName: 'init' }, 'Connections storage initialized');
  }

  /**
   *
   */
  toString() {
    this._store.forEach((key, value) => {
      console.log(`m[${key}] = ${value}`);
    });
  }

  /**
   * Add connection to storage
   * @param {String} guildId - guild ID
   * @param {PlayerSubscription} - guild connection
   * @return {void}
   */
  addConnection(guildId, subscription) {
    this._store.set(guildId, subscription);
  }

  /**
   * Get connection with player
   * @param {String} guildId - guild ID
   * @return {PlayerSubscription}
   */
  getConnection(guildId) {
    if (this._store.has(guildId)) {
      return this._store.get(guildId);
    }
    return null;
  }

  removeConnection(guildId) {
    this._store.delete(guildId);
  }
}

module.exports = ConnectionsStorage;

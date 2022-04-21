const BaseCommand = require('./base_command');
const log = require('../src/common/logger').child({ className: 'PingCommand' });

class PingCommand extends BaseCommand {
  constructor() {
    super();
    this.description = 'Ping!';
  }

  execute(message) {
    log.info({ methodName: 'execute' }, 'Start ping');
    message.channel.send('понг епта');
    log.info({ methodName: 'execute' }, 'End ping');
  }
}

module.exports = new PingCommand();

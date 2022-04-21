const BaseCommand = require('./base_command');

class PingCommand extends BaseCommand {
  constructor() {
    super();
    this.description = 'Ping!';
  }

  execute(message) {
    message.channel.send('понг епта');
  }
}

module.exports = new PingCommand();

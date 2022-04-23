const BaseCommand = require('./base_command');

class ShowQueue extends BaseCommand {
  constructor() {
    super();
    this.description = 'ShowQueue';
  }

  async execute(message) {
    message.channel.send('Чет там есть братанчик, я хз');
  }
}
module.exports = new ShowQueue();

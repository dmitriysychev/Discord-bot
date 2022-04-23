const BaseCommand = require('./base_command');
const storage = require('../src/storage');

class LeaveCommand extends BaseCommand {
  constructor() {
    super();
    this.description = 'Command to leave the voice chat';
  }

  async execute(message) {
    await storage.musicQueue.clear(message.guildId);
    if (message.member.voice.channel) {
      const subscribtion = storage.connections.getConnection(message.guildId);
      if (subscribtion) {
        subscribtion.unsubscribe();
        subscribtion.connection.destroy();
        message.channel.send('Сам уйди, Э!');
        return;
      }
      message.channel.send('Ты ща у меня уйдешь!');
      return;
    }
    message.channel.send('Сначала в войс канал зайди, другалек');
  }
}
module.exports = new LeaveCommand();

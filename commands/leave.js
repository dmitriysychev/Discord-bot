const connectionStorage = require('../src/storage/connections_storage');
const BaseCommand = require('./base_command');

class LeaveCommand extends BaseCommand {
  constructor() {
    super();
    this.description = 'Command to leave the voice chat';
  }

  async execute(bot, message) {
    bot._queuesOfChannelsMusic.clear();
    if (message.member.voice.channel) {
      const subscribtion = connectionStorage.getConnection(message.guildId);
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

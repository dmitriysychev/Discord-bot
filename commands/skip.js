const { createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const BaseCommand = require('./base_command');
const storage = require('../src/storage');
const { connectToAuthorChannel } = require('../src/utils');

class SkipCommand extends BaseCommand {
  constructor() {
    super();
    this.description = 'Skip!';
  }

  async execute(message) {
    const url = await storage.musicQueue.poll(message.guildId);
    let subscription = storage.connections.getConnection(message.guildId);
    if (!url) {
      if (!subscription) {
        message.channel.send('Таки нехер скипать');
        return;
      }
      subscription.connection.destroy();
      message.channel.send('А очереди нет песен, гений!');
      message.channel.send(':clown:');
      return;
    }
    if (!subscription) {
      subscription = connectToAuthorChannel(message);
    }
    const { videoDetails: { title } } = await ytdl.getInfo(url);
    subscription.player.play(createAudioResource(ytdl(url, { volume: 5 })));
    message.channel.send(`Ща ебошит **${title}**`);
  }
}

module.exports = new SkipCommand();

/* eslint-disable no-param-reassign */
const ytdl = require('ytdl-core');
const {
  createAudioResource, AudioPlayerPlayingState, AudioPlayerStatus,
} = require('@discordjs/voice');
const { connectToAuthorChannel } = require('../src/utils');
const storage = require('../src/storage');
const BaseCommand = require('./base_command');

class PlayCommand extends BaseCommand {
  constructor() {
    super();
    this.description = 'Play!';
  }

  async execute(message, [url]) {
    if (!url.includes('youtube')) {
      message.channel.send('С ютубы мне давай');
      message.channel.send('<:6101_JohnnySins:713412350564106240>');
      return;
    }

    const { player } = connectToAuthorChannel(message);
    console.log(player.state, AudioPlayerPlayingState);

    if (player.state.status !== AudioPlayerStatus.Playing) {
      const { videoDetails: { title } } = await ytdl.getInfo(url);
      player.play(createAudioResource(ytdl(url, { volume: 5 })));
      message.channel.send(`Ща ебошит **${title}**`);
    } else {
      await storage.musicQueue.push(message.guildId, url);
    }
  }
}

module.exports = new PlayCommand();

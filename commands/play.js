/* eslint-disable no-param-reassign */
const ytdl = require('ytdl-core');
const { createAudioResource } = require('@discordjs/voice');
const { connectToAuthorChannel } = require('../src/utils');
const storage = require('../src/storage');
const BaseCommand = require('./base_command');

class PlayCommand extends BaseCommand {
  constructor() {
    super();
    this.description = 'Play!';
  }

  async playUrl(message, queue) {
    //const url = queue.isInterrupted ? queue.top() : queue.poll();
    const url = queue.poll();
    //queue.isInterrupted = false;
    if (!url) {
      //queue.isPlaying = false;
      message.member.voice.channel.leave();

      message.channel.send('Ваша песенка спета');
      return;
    }
    //queue.isPlaying = true;

    const [{ videoDetails: { title } }, subscription] = await Promise.all([
      await ytdl.getInfo(url),
      connectToAuthorChannel(message),
    ]);
    console.log(subscription);
    message.channel.send(`Ща ебошит: **${title}**`);
    await subscription.player.play(createAudioResource(ytdl(url, { volume: 5, filter: 'audioonly' })));
  }

  async execute(message, [url]) {
    if (!url.includes('youtube')) {
      message.channel.send('С ютубы мне давай');
      message.channel.send('<:6101_JohnnySins:713412350564106240>');
      return;
    }

    storage.musicQueue.push(message.guildId, url);

    // TODO: fix flags
    if (storage.musicQueue.isEmpty(message.guildId))// && !bot._queuesOfChannelsMusic.isPlaying) {
      await this.playUrl(message, storage.musicQueue);
    }
  }
  


module.exports = new PlayCommand();

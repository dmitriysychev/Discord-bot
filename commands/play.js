/* eslint-disable no-param-reassign */
const ytdl = require('ytdl-core');
const { createAudioResource } = require('@discordjs/voice');
const { connectToAuthorChannel } = require('../src/utils');

async function playUrl(message, queue) {
  const url = queue.isInterrupted ? queue.top() : queue.poll();
  queue.isInterrupted = false;
  if (!url) {
    queue.isPlaying = false;
    message.member.voice.channel.leave();

    message.channel.send('Ваша песенка спета');
    return;
  }
  queue.isPlaying = true;

  const [{ videoDetails: { title } }, subscription] = await Promise.all([
    await ytdl.getInfo(url),
    connectToAuthorChannel(message),
  ]);
  console.log(subscription);
  message.channel.send(`Ща ебошит: **${title}**`);
  await subscription.player.play(createAudioResource(ytdl(url, { volume: 5, filter: 'audioonly' })));
}

async function execute(bot, message, [url]) {
  if (!url.includes('youtube')) {
    message.channel.send('С ютубы мне давай');
    message.channel.send('<:6101_JohnnySins:713412350564106240>');
    return;
  }

  if (bot._queuesOfChannelsMusic.isEmpty && !bot._queuesOfChannelsMusic.isPlaying) {
    bot._queuesOfChannelsMusic.push(url);
    await playUrl(message, bot._queuesOfChannelsMusic);
  } else {
    bot._queuesOfChannelsMusic.push(url);
  }
}

module.exports = {
  name: '.ебашь',
  execute,
  playUrl,
};

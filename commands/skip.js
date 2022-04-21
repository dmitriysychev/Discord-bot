const { playUrl } = require('./play');

module.exports = {
  name: '.некст',
  async execute(bot, msg) {
    await playUrl(msg, bot._queuesOfChannelsMusic);
  },
};

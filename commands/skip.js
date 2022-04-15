const MusicQueue = require("../src/MusicQueue")
const { playUrl } = require("./play");

module.exports = {
    name: '.некст',
    async execute(bot, msg, arg) {
        await playUrl(msg, bot._queuesOfChannelsMusic);
    }
}
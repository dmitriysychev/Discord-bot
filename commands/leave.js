const MusicQueue = require("../src/MusicQueue");

module.exports = {
    name : '.уйди',
    async execute (bot, message, args) {
        bot._queuesOfChannelsMusic.clear();
        if (message.member.voice.channel) {
            await message.member.voice.channel.leave();
        }
    },
};

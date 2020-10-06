const MusicQueue = require("../src/MusicQueue");

module.exports = {
    name : '.уйди',
    async execute (message, args) {
        musicQueue.clear();
        if (message.member.voice.channel) {
            await message.member.voice.channel.leave();
        }
    },
};

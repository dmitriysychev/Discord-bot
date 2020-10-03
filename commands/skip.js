const MusicQueue = require("../src/MusicQueue")
const ytdl = require('ytdl-core');

module.exports = {
    name: '.некст',
    async execute(msg, arg) {
        msg.channel.send(".уйди");
        // if (!musicQueue.isEmpty()) {
        //     let nextSong = musicQueue.poll();
        //     console.log(musicDispatcher);
        //     if (musicDispatcher) {
        //         musicDispatcher.start(ytdl(nextSong, { quality: 'highestaudio', volume: 0.4}));
        //     }
        // } else {
        //     msg.reply("Очередь пустая, олень!");
        // }
    }
}
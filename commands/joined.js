const MusicQueue = require('../src/MusicQueue');
const { playUrl } = require('./play');


module.exports = {
    name: '.зайди',
    async execute(bot, message, args) { 
        if (message.member.voice.channel) {
            //music stuff
            message.channel.send("Зашел хуле блять");
            bot._queuesOfChannelsMusic.clear();

            if (bot._queuesOfChannelsMusic.isPlaying) {
                bot._queuesOfChannelsMusic.isInterrupted = true;
            }
            const connection = await message.member.voice.channel.join();
            musicDispatcher = await connection.play('./sounds/joined.mp3', {volume : 0.5});
            musicDispatcher.on('finish', async () => {
                await playUrl(message, bot._queuesOfChannelsMusic);
            });
        } else {
            message.reply('You need to join a voice channel first!');
        }
    },
};

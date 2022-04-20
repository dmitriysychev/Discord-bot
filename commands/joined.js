const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus, entersState  } = require('@discordjs/voice');
const MusicQueue = require('../src/MusicQueue');
const { playUrl } = require('./play');
const { connectToAuthorChannel } = require('../src/utils');


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

            const { player } = connectToAuthorChannel(message);
            player.play(createAudioResource('./sounds/joined.mp3'));
        } else {
            message.reply('You need to join a voice channel first!');
        }
    },
};

const MusicQueue = require("../src/MusicQueue");
const connectionStorage = require('../src/storage/connections_storage');

module.exports = {
    name : '.уйди',
    async execute (bot, message, args) {
        bot._queuesOfChannelsMusic.clear();
        if (message.member.voice.channel) {
            const subscribtion = connectionStorage.getConnection(message.guildId);
            if (subscribtion) {
                subscribtion.unsubscribe();
                subscribtion.connection.destroy();
                message.channel.send('Сам уйди, Э!');
                return;
            }
            message.channel.send('Ты ща у меня уйдешь!');
            return;
        }
        message.channel.send("Сначала в войс канал зайди, другалек");
    },
};

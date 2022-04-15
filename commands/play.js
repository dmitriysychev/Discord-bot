const ytdl = require('ytdl-core');

async function execute(bot, message, [url, ...rest]) {
    console.log(bot._queuesOfChannelsMusic);

    if (bot._queuesOfChannelsMusic.isEmpty && !bot._queuesOfChannelsMusic.isPlaying) {
        bot._queuesOfChannelsMusic.push(url);
        await playUrl(message, bot._queuesOfChannelsMusic)
    } else {
        bot._queuesOfChannelsMusic.push(url);
    }
}

async function playUrl(message, queue) {
    console.log('\nCall ---------\n');
    console.log(queue);
    const url = queue.poll();
    if (!url) {
        queue.isPlaying = false;
        message.member.voice.channel.leave();
        
        message.channel.send(`Ваша песенка спета`);
        return;
    }
    queue.isPlaying = true;

    message.channel.send(`Ща ебошит: **${url}**`);
    
    console.log(url);
    const connection = await message.member.voice.channel.join();
    await connection.play(ytdl(url, { volume: 5 }))
        .on("finish", async () => {
            console.log('finished ' + url);
            
            await playUrl(message, queue);
        })
        .on("error", error => console.error(error));
}

module.exports = {
    name: '.ебашь',
    execute,
    playUrl,
};
            

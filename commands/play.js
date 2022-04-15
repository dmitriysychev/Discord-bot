const ytdl = require('ytdl-core');

async function execute(bot, message, [url, ...rest]) {
    console.log(message.client.emojis);
    if (!url.includes('youtube')) {
        message.channel.send('С ютубы мне давай');
        message.channel.send('<:6101_JohnnySins:713412350564106240>');
        return;
    }

    if (bot._queuesOfChannelsMusic.isEmpty && !bot._queuesOfChannelsMusic.isPlaying) {
        bot._queuesOfChannelsMusic.push(url);
        await playUrl(message, bot._queuesOfChannelsMusic)
    } else {
        bot._queuesOfChannelsMusic.push(url);
    }
}

async function playUrl(message, queue) {
    const url = queue.isInterrupted ? queue.top() : queue.poll();
    queue.isInterrupted = false;
    if (!url) {
        queue.isPlaying = false;
        message.member.voice.channel.leave();
        
        message.channel.send(`Ваша песенка спета`);
        return;
    }
    queue.isPlaying = true;
    
    const [{videoDetails: {title}}, connection] = await Promise.all([
        await ytdl.getInfo(url),
        message.member.voice.channel.join(),
    ]);
    message.channel.send(`Ща ебошит: **${title}**`);
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
            

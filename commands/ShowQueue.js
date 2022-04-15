module.exports = {
    name: '.покажи',
    execute(bot, msg, args) {
        if(!bot._queuesOfChannelsMusic.isEmpty) {
            //msg.channel.send('```'+ musicQueue.show() + '```');
            msg.channel.send('``` У вас в очереди ' + bot._queuesOfChannelsMusic.length + ' песен ```');
        } else {
            msg.channel.send("У вас в очереди нету песен");
        }
    }
};
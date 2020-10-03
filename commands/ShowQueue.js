module.exports = {
    name: '.покажи',
    execute(msg, args) {
        if(!musicQueue.isEmpty()) {
            //msg.channel.send('```'+ musicQueue.show() + '```');
            msg.channel.send('``` У вас в очереди ' + musicQueue.length + ' песен ```');
        } else {
            msg.channel.send("У вас в очереди нету песен");
        }
    }
};
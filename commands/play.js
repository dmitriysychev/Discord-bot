const ytdl = require('ytdl-core');

module.exports = {
    name: '.ебашь',
    async execute(message, args) {
        console.log('The function has been moved to index.js');
        /*
        const argse = message.content.split(" ");
        if (argse.length < 2) {
            message.channel.send("Ты не указал песню уебан");
        } else {
            const connection = await message.member.voice.channel.join();
            console.log(connection.speaking.bitfield);
            //если бот уже играет песню
            if (connection.speaking.bitfield) {
                let url = argse[1];
                console.log('url to queue', url);
                musicQueue.push(url);
            } else {
                console.log(`Очередь пустая? ${musicQueue.isEmpty()}`);
                musicDispatcher = await connection.play(ytdl(argse[1], { quality: 'highestaudio', volume: 0.4}));
                musicDispatcher.on('finish', async () => {
                    if (!musicQueue.isEmpty()){
                        let toPlay = musicQueue.poll();
                        console.log('toPlay\n', toPlay);
                        connection.play(ytdl(toPlay,  { quality: 'highestaudio', volume: 0.4}));
                    } else {
                        message.channel.send("Уебанчики, музло кончилось");
                    }
                    
                })
            }
        }
        */
        },
  };
            
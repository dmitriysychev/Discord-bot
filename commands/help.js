module.exports = {
    name: '.как',
    execute(bot, msg, args) {
        //msg.reply('pong');
        let help = '```.как (помощь)\n.пинг\n.ору\n.привет\n.аватар\n.зайди (подключить бота)\n.уйди (выгнать нахуй бота)\n.ебашь (играть песню)\n.покажи(очередь песен)\n.некст (некст песня)```'
        msg.channel.send(help);
    },
};
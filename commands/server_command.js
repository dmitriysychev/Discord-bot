module.exports = {
    name: '.сервер',
    execute(bot, msg, args) {
        //msg.reply('pong');
        msg.channel.send(`Название сервера: ${msg.guild.name}\nКол-во участников: ${msg.guild.memberCount}`);
    },
};
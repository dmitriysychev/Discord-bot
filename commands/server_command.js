module.exports = {
    name: '.сервер',
    execute(msg, args) {
        //msg.reply('pong');
        msg.channel.send(`Название сервера: ${msg.guild.name}\nКол-во участников: ${msg.guild.memberCount}`);
    },
};
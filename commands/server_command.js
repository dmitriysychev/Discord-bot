module.exports = {
  name: '.сервер',
  execute(bot, msg) {
    msg.channel.send(`Название сервера: ${msg.guild.name}\nКол-во участников: ${msg.guild.memberCount}`);
  },
};

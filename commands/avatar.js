module.exports = {
  name: '.аватар',
  aliases: ['.иконка', '.фотка'],
  execute(bot, message) {
    if (!message.mentions.users.size) {
      message.channel.send(`Твоя фотка: <${message.author.displayAvatarURL}>`);
      return;
    }
    message.mentions.users.map((user) => message.channel.send(`Фотка ${user.username}: <${user.displayAvatarURL}>`));
  },
};

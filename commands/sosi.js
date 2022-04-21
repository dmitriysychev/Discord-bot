module.exports = {
  name: 'соси',
  description: 'САСАТЬ!',
  execute(bot, msg) {
    if (msg.author.username !== 'PopchillBot') {
      msg.reply('сам соси еблан');
    }
  },
};

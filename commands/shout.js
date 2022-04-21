module.exports = {
  name: '.ору',
  description: 'Оралка!',
  execute(bot, msg) {
    // msg.reply('pong');
    const m = `${msg.content}`;
    if (m.length > 4) {
      const content = m.substr(m.indexOf(' ') + 1).toUpperCase();
      msg.delete();
      msg.channel.send(content);
    } else {
      msg.reply('Ну и ори дальше уебан');
    }
  },
};

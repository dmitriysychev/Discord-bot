module.exports = {
    name: '.ору',
    description: 'Оралка!',
    execute(msg, args) {
      //msg.reply('pong');
        let m = `${msg.content}`;
        if (m.length > 4) {
            let content = m.substr(m.indexOf(" ") + 1).toUpperCase();
            msg.delete();
            msg.channel.send(content);
        } else {
            msg.reply(`Ну и ори дальше уебан`);
        }
    },
  };
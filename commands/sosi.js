module.exports = {
    name: 'соси',
    description: 'САСАТЬ!',
    execute(msg, args) {
        if (msg.author.username != 'PopchillBot'){
            msg.reply('сам соси еблан');
        }
    },
};
  
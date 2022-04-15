module.exports = {
    name : '.аватар',
    aliases: ['.иконка', '.фотка'],
    execute(bot, message, args) {
        if (!message.mentions.users.size) {
            return message.channel.send(`Твоя фотка: <${message.author.displayAvatarURL}>`);
        } 
        const avatarList = message.mentions.users.map(user => {
            return message.channel.send(`Фотка ${user.username}: <${user.displayAvatarURL}>`);
        });
    },
}
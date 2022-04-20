require('dotenv').config();
const Bot = require('./src/Bot');
const Action = require('./src/Action');
const server = require('./server');

const config = require('./config/client.json');
const customLangPack = require('./lang/' + ( 'default') + '.json');
const actions = require('./commands/index');
const vipUsers = require('./config/vipUsers.json');

const bot = new Bot(process.env.token, config.prefix, customLangPack);

for (let action in actions) {
    let newAction = new Action(
        actions[action].name, 
        actions[action].aliases, 
        actions[action].description, 
        actions[action].execute
    );

    bot.addActionHandler(newAction);
}

for (let vipUser in vipUsers) {
    bot.setVipUser(vipUser, vipUsers[vipUser])
}

server.listen(process.env.PORT, async () => {
    try {
        await bot.launch();
    } catch (error) {
        console.log('FATAL_BOT_ERROR', error);
    }
});

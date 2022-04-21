require('dotenv').config();
const fetch = require('node-fetch');

const storage = require('./src/storage');
const Bot = require('./src/Bot');
const Action = require('./src/Action');
const server = require('./server');
const { log } = require('./src/common/logger');

const config = require('./config/client.json');

const customLangPack = require('./lang/default.json');
const actions = require('./commands/index');
const vipUsers = require('./config/vipUsers.json');

const bot = new Bot(process.env.token, config.prefix, customLangPack);

// eslint-disable-next-line guard-for-in
for (const action in actions) {
  const newAction = new Action(
    action,
    actions[action].aliases,
    actions[action].description,
    actions[action].execute,
  );

  bot.addActionHandler(newAction);
}

// eslint-disable-next-line guard-for-in
for (const vipUser in vipUsers) {
  bot.setVipUser(vipUser, vipUsers[vipUser]);
}

// intialize storage then sping up the server
storage.init().then(() => {
  server.listen(process.env.PORT, async () => {
    setInterval(() => {
      fetch(process.env.SELF_URL, { method: 'GET' }).catch((err) => log.error({ err }, 'FETCH_ERROR'));
    }, process.env.PING_TIMEOUT);
    try {
      await bot.launch();
    } catch (error) {
      console.log('FATAL_BOT_ERROR', error);
    }
  });
}).catch((err) => {
  log.error({ err }, 'STORAGE_NOT_INITIALIZED');
  process.exit(-1);
});

process.on('uncaughtException', (err) => {
  log.error({ methodName: 'uncaughtException', err }, 'UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (err) => {
  log.error({ methodName: '', err }, 'UNHANDLED_REJECTION');
});

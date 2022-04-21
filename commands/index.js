const Ping = require('./ping');
const Join = require('./joined');
const Play = require('./play');
const Show = require('./ShowQueue');
const Leave = require('./leave');

const commandMap = {
  пинг: Ping,
  зайди: Join,
  играй: Play,
  уйди: Leave,
  покажи: Show,
};

module.exports = commandMap;

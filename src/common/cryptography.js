const crypto = require('crypto');

const RANDOM_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const md5HashString = (str) => crypto.createHash('md5').update(str).digest('hex');

const getRandomNumber = (from, to) => crypto.randomInt(from, to);

const getRandomString = (length = 22) => {
  const randomBytes = crypto.randomBytes(length);
  const result = new Array(length);
  let cursor = 0;
  const charsLength = RANDOM_CHARS.length;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    cursor += randomBytes[i];
    result[i] = RANDOM_CHARS[cursor % charsLength];
  }

  return result.join('');
};

module.exports = {
  md5HashString,
  getRandomNumber,
  getRandomString,
};

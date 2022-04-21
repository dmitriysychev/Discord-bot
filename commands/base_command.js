class BaseCommand {
  // eslint-disable-next-line no-unused-vars
  execute(message) {
    throw new Error('NOT_IMPLEMENTED');
  }
}

module.exports = BaseCommand;

const { createAudioResource } = require('@discordjs/voice');

const { connectToAuthorChannel } = require('../src/utils');

const BaseCommand = require('./base_command');

class JoinCommand extends BaseCommand {
  constructor() {
    super();
    this.description = 'Command to join the voice channgel';
    this.name = 'зайди';
  }

  async execute(message) {
    if (message.member.voice.channel) {
      // music stuff
      message.channel.send('Зашел хуле блять');

      const { player } = connectToAuthorChannel(message);
      player.play(createAudioResource('./sounds/joined.mp3'));
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }
}

module.exports = new JoinCommand();

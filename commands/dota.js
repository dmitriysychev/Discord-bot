module.exports = {
  name: '.дота',
  async execute(bot, message) {
    const connection = await message.member.voice.channel.join();
    await connection
      .play('./sounds/дота.mp3')
      .on('finish', () => {
        message.member.voice.channel.leave();
      });
  },
};

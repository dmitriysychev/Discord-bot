module.exports = {
    name : '.дота',
    async execute (bot, message, args) {
        const connection = await message.member.voice.channel.join();
        const dsp = await connection
            .play('./sounds/дота.mp3')
            .on("finish", () => {
                message.member.voice.channel.leave();
            });
    },
};
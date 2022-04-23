const {
  joinVoiceChannel,
  createAudioPlayer,
  VoiceConnectionStatus,
  AudioPlayerStatus,
  createAudioResource,
} = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const storage = require('../storage');

function connectToAuthorChannel(message) {
  const existingConnection = storage.connections.getConnection(message.guildId);
  if (existingConnection) {
    return existingConnection;
  }

  const connection = joinVoiceChannel({
    channelId: message.member.voice.channelId,
    guildId: message.guildId,
    adapterCreator: message.guild.voiceAdapterCreator,
  });

  const player = createAudioPlayer();
  const subscription = connection.subscribe(player);

  connection.on(VoiceConnectionStatus.Ready, () => {
    console.log('The connection has entered the Ready state - ready to play audio!');
  });

  connection.on(VoiceConnectionStatus.Disconnected, () => {
    console.log('disconnected from voice channel');
    connection.destroy();
  });
  connection.on(VoiceConnectionStatus.Destroyed, () => {
    storage.connections.removeConnection(message.guildId);
  });

  player.on(AudioPlayerStatus.Idle, async () => {
    const url = await storage.musicQueue.poll(message.guildId);
    if (!url) {
      connection.destroy();
    }
    const { videoDetails: { title } } = await ytdl.getInfo(url);
    player.play(createAudioResource(ytdl(url, { volume: 5 })));
    message.channel.send(`Ща ебошит **${title}**`);
  });

  storage.connections.addConnection(message.guildId, subscription);

  if (process.env.DEBUG) {
    console.log('Added connection to storage');
    storage.connections.toString();
  }

  return subscription;
}

module.exports = {
  connectToAuthorChannel,
};

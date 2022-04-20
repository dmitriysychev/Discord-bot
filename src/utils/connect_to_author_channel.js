const connectionStorage = require('../storage/connections_storage');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus, entersState } = require('@discordjs/voice');

function connectToAuthorChannel(message) {
  const existingConnection = connectionStorage.getConnection(message.guildId);
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

  connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
    console.log('disconnected from voice channel');
    connectionStorage.removeConnection(message.guildId);
    connection.destroy();
  });

  connectionStorage.addConnection(message.guildId, subscription);

  if (process.env.DEBUG){
    console.log(`Added connection to storage`);
     connectionStorage.toString();
  }

  return subscription;
}


module.exports = {
  connectToAuthorChannel,
};

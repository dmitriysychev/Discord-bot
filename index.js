require('dotenv').config();
const Discord = require('discord.js');
const MusicQueue = require('./src/MusicQueue');
const ytdl = require('ytdl-core');
let users = new Map();

const customLangPack = require('./lang/' + ( 'default') + '.json');
//addition for music bot
global.musicQueue = new MusicQueue();
global.musicDispatcher = null;
const { prefix, token } = require('./config/client.json');

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const queue = new Map();

const muteFile = './sounds/мут.mp3';
const unmuteFile ='./sounds/размут.mp3';


const botCommands = require('./commands');
// const { execute } = require('./commands/play');

Object.keys(botCommands).map(key => {
    bot.commands.set(botCommands[key].name, botCommands[key]);
});

//const TOKEN = process.env.TOKEN;

bot.login(token);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
    users.set('611520086733357072', {file: './sounds/жекасалам.mp3', muted: 0, user: 'Женя'});
    users.set('323200937067806722', {file: './sounds/рафасалам.mp3', muted: 0, user: 'Рафа'});
    users.set('648526261794242601', {file: './sounds/кирпичсалам.ogg', muted: 0, user: 'Кирыч'});
    users.set('367237696281903114', {file: './sounds/колясалам.ogg', muted: 0, user: 'Коля'});
    users.set('692231171781951488', {file: './sounds/димасалам.ogg', muted: 0, user: 'Дима'});
});

bot.on('message', async msg => {
    // console.log(`author msg id: ${msg.author.id}, username: ${msg.author.username}`);
    // console.log(msg.guild.members);

    const serverQueue = queue.get(msg.guild.id);
    //console.log(`MEMBER USERNAME ${msg.author.username}`);
    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    //console.log(args[0]);
    if (args[0] === `@!750905378753085474>`) {
        msg.reply(`Че надо ебланчик?`);
    }
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const command = '.' + args.shift().toLowerCase();

    //music
    if (command === '.ебошь') {
        exec(msg, serverQueue);
        return;
    } else if (command === '.стоп') {
        stop(msg, serverQueue);
        return;
    } else if (command === '.некст') {
        skip(msg, serverQueue);
        return;
    }

    if (!bot.commands.has(command)) {
        msg.reply('НЕ ЗНАЮ ЧЕГО ТЫ ХОЧЕШЬ, БРАТАНЧИК, НО ЛУЧШЕ БЫРЕНЬКО ОТЪЕБАЛСЯ ОТ МЕНЯ :rage: ')
    } else {
        try {
            bot.commands.get(command).execute(msg, args);
        } catch (error) {
            console.error(error);
            msg.reply('НЕ ЗНАЮ ЧЕГО ТЫ ХОЧЕШЬ, БРАТАНЧИК, НО ЛУЧШЕ БЫРЕНЬКО ОТЪЕБАЛСЯ ОТ МЕНЯ :rage: ');
        }
    };

});

async function exec(message, serverQueue) {
    const args = message.content.split(" ");
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
        return message.channel.send("Ты должен быть в голосовом чтобы использовать эту команду, уеба!");
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
        "Ты мне не разрешил заходить в голосовой бля, че я сдеаю...."
        );
    }

    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    };

    if (!serverQueue) {
        const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true,
        };
        // Setting the queue using our contract
        queue.set(message.guild.id, queueContruct);
        // Pushing the song to our songs array
        queueContruct.songs.push(song);

        try {
        // Here we try to join the voicechat and save our connection into our object.
        var connection = await voiceChannel.join();
        queueContruct.connection = connection;
        play(message.guild, queueContruct.songs[0]);
        } catch (err) {
        // Printing the error message if the bot fails to join the voicechat
        console.log(err);
        queue.delete(message.guild.id);
        return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        return message.channel.send(`${song.title} была добавлена в очередь`);
    }
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));

    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Ща ебошит: **${song.title}**`);
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel) {
    return message.channel.send(
      "Ты должен быть в голосом чтобы остановить музыку алло!"
    );
  }

  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}


function skip(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
        "Ты должен быть в голосом чтобы остановить музыку алло!"
        );
    if (!serverQueue)
        return message.channel.send("В очереди нету песен уеба!");
    serverQueue.connection.dispatcher.end();
}

//end of execute

bot.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  console.info(member.guild);
  const channel = member.guild.channels.find(ch => ch.name === 'general');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Здарова хуесосик, ${member}`);
});


// Если кто то заходит в голосовой канал
bot.on('voiceStateUpdate', async (oldMember, newMember) => {
  
  if (newMember.id != '750905378753085474') {
     console.log(`User with id: ${newMember.id}, by the name: ${users.get(newMember.id).user} voice channel`);
     console.log(`User mute status: ${users.get(newMember.id).mute}`);
     let con = null;
     try{
      con = await newMember.channel.join();
     }catch {
       console.error;
     }
     

      let newUserChannel = newMember.channel;
      let oldMemberChannel = oldMember.channel;
      if (newUserChannel != null) {
        
        if (newMember.selfMute) {
          console.log(`Somebody got muted: ${users.get(newMember.id).user}`);
          users.get(newMember.id).mute = 1;
          const dsp = con
            .play(muteFile, { volume: 0.8 })
            .on("finish", () => {
              newMember.channel.leave();
            });
            return;
        } else if (!newMember.selfMute) {
          console.log(`User mute status in else if: ${users.get(newMember.id).mute}`);
          console.log(`Somebody got UNmuted: ${users.get(newMember.id).user}`);
          if (users.get(newMember.id).mute === 1) {
            users.get(newMember.id).mute = 0;
            const dsp = con
              .play(unmuteFile, { volume: 0.8 })
              .on("finish", () => {
                newMember.channel.leave();
              });
            return;
          } else {
            console.log("technically should play music");
            let musicFile = users.get(newMember.id).file;
            const dsp = con
              .play(musicFile, { volume: 0.8 })
              .on("finish", () => {
                newMember.channel.leave();
              });
          }
        }
      } else if (oldMemberChannel != null) {
        let oldCon = await oldMember.channel.join();
        console.log(` ${oldMember.id} left the channel`);
        oldCon.play('./sounds/съебал.mp3');
      }
  }
});

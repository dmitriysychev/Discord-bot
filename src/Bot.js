const Discord = require('discord.js');
const Action = require('./Action');

class Bot {
    /**
     * 
     * @param {String} token - secret token for your bot
     * @param {String} prefix - prefix of bots commands
     */
    constructor (token, prefix, langPack) {

        this._token = token;
        this._prefix = prefix;
        this._bot = new Discord.Client();
        this._bot.commands = new Discord.Collection();
        this._VIPUsers = new Map();
        this._langPack = langPack;

        this._queuesOfChannelsMusic = new Map();

        process.on('exit', this.stop)
    }

    /**
     * Login your bot in Discord. REQUIRED method!
     */
    async launch() {
        try {
            await this._bot.login(this._token);
            this._authorize = true;
            
            this._bot.on('ready', () => { this.onReadyListener() });
        } catch (error) {
            console.log(error);
            process.exit(1);
        }
    }
    /**
     * 
     */
    async onReadyListener() {
        console.info(`Logged in as ${this._bot.user.tag}!`);

        this._bot.on('message', (message) => { this.onMessageListener(message)});
        this._bot.on('voiceStateUpdate', (olduser, newuser) => { this.onVoiceStateUpdate(olduser, newuser)});
    }

    /**
     * 
     * @param {*} message 
     */
    onMessageListener(message) {
        if (!message.content.startsWith(this._prefix) || message.author.bot) return;
        // if someone tagged bot
        const args = message.content.slice(this._prefix.length).trim().split(/ +/);
        if (args[0] === this._bot.user.id) {
            message.reply(this._langPack.whatDoYouWant);
        }

        //parse out the command
        const command = this._prefix + args.shift().toLowerCase();
        if (!this._bot.commands.has(command)) {
            console.log(this._bot.commands);
            message.reply(this._langPack.invalidCommand);
        } else {
            try {
                let action = this._bot.commands.get(command);
                action.execute(message, args);
            } catch (error) {
                console.error(error);
                message.reply(this._langPack.error);
            }
        };
    }
    /**
     * 
     * @param {*} userLeft a user that left the voice channel
     * @param {*} userJoine a user that joined the voice channel
     */
    onVoiceStateUpdate(userLeft, userJoined) {
        if (userJoined.id != this._bot.user.id) {
            let actionType = this.getVoiceChannelUpdateType(userLeft, userJoined);

            switch (actionType) {
                case 'join': 
                    console.log(`User with id: ${userJoined.id}, by the name: ${this._VIPUsers.get(userJoined.id).user} joined voice channel`);
                    let userFile = this._VIPUsers.get(userJoined.id).file;
                    console.log(userFile);
                    this.playFile(userJoined, userFile);
                    break;
                case 'leave':
                    console.log(` ${userLeft.id} left the channel`);
                    this.playFile(userLeft, 'съебал.mp3');
                    break;
                case 'mute':
                    this._VIPUsers.get(userJoined.id).muted = 1;
                    console.log(`${this._VIPUsers.get(userJoined.id).user} muted itself`);
                    this.playFile(userJoined, 'мут.mp3');
                    break;
                case 'unmute':
                    this._VIPUsers.get(userJoined.id).muted = 0;
                    console.log(`${this._VIPUsers.get(userJoined.id).user} unmuted itself`);
                    this.playFile(userJoined, 'размут.mp3');
                    break;
                case 'otherState':

                    break;                
            }
        }
    }
    /**
     * 
     * @param {*} user 
     * @param {*} file 
     */
    async playFile(user, file) {
        try {
            let connection = await user.channel.join();
            return connection.play('./sounds/' + file).on("finish", () => user.channel.leave());
        } catch (error) {
            console.error('Error in playFile method:\n', error);
            throw new Error(error);
        }
    }
    /**
     * 
     * @param {*} userLeft 
     * @param {*} userJoined 
     */
    getVoiceChannelUpdateType(userLeft, userJoined) {
        if (userJoined.channel != null) {
            if (userJoined.selfMute) {
                return 'mute';
            } else{
                if (this._VIPUsers.get(userJoined.id).muted === 1) {
                    return 'unmute';
                } else {
                    return 'join';
                }
            }
        } else if (userLeft.channel != null) {
            return 'leave'
        } else {
            return 'otherState';
        }
    }

    /**
     * 
     * @param {Action} action 
     */
    addActionHandler (action) {
        if(!action instanceof Action) {
            throw TypeError('argument should be instance of Action class');
        }

        this._bot.commands.set(action.name, action);

        action.aliases.forEach((alias) => {
            this._bot.commands.set(alias, action);
        })
    }
    /**
     * 
     * @param {String} userID user id to attach the sound file to
     * @param {*} soundFile a custom sound file that will be played when user joins voice channel
     * @param {*} alias user alias that is attached to the sound file
     */
    setVipUser(userID,options) {
        this._VIPUsers.set(userID, options);
    }
    /**
     * Method, that will be called, when bot application exits
     */
    async stop() {
        try {
            if (this._authorize) {
                await this._bot.destroy();
            }
            console.log('Bot shutdown')
        } catch (error) {
            console.log(error);
            process.exit(1);
        }
    }
}

module.exports = Bot;
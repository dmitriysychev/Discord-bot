const Discord = require('discord.js');
const Action = require('./Action');

class Bot {
    /**
     * 
     * @param {String} token - secret token for your bot
     * @param {String} prefix - prefix of bots commands
     */
    constructor (token, prefix) {

        this._token = token;
        this._prefix = prefix;
        this._actionsNaming = actionsNaming;
        this._bot = new Discord.Client();
        this._bot.commands = new Discord.Collection();

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
            console.log('Bot successful connected to discord API');
        } catch (error) {
            console.log(error);
            process.exit(1);
        }
    }

    onReadyListner() {
        
    }

    /**
     * 
     * @param {Action} action 
     */
    addActionHandler (action) {
        if(!action instanceof Action) {
            throw TypeError('argument should be instance of Action class');
        }

        this._bot.commands.set(action.name, action.execute);
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
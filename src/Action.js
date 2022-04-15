class Action {
    constructor(name, aliases = [], description = '', execute) {
        this.name = name;
        this.aliases = aliases;
        this.description = description;
        if (!execute) {
            throw new Error(`Missing executable function for action ${name}`)
        }
        this._execute = execute;
    }

    async execute(bot, message, args) {
        try {
            await this._execute(bot, message, args);
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
}

module.exports = Action;
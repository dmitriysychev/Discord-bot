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

    async execute(message) {
        try {
            await this._execute(message);
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
}

module.exports = Action;
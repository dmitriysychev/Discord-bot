class ComandHandler {
    constructor(name, description, handler) {
        this.name = name;
        this.description = description;
        this.handler = handler;
    }

    get nameBot() {
        return ` ${this.name}`;
    }
}

let CH = new ComandHandler('Leha', '123', () => {return true;});

CH.nameBot;

class MusicQueue {
    /**
     * @param {Array} queue - initial value of queue, [] by default.
     */
    constructor(queue = []) {
        this._queue = queue;
        this.isPlaying = false;
        this.isInterrupted = false;
    }

    get length() {
        return this._queue.length
    }

    push(element) {
        this._queue.unshift(element);
    }

    poll() {
        return this._queue.splice(this._queue.length - 1, 1)[0];
    }

    top() {
        return this._queue[0];
    }

    get isEmpty() {
        return this._queue.length === 0
    }

    clear() {
        this._queue = [];
    }

    show() {
       return this._queue;
    }
}

module.exports = MusicQueue;

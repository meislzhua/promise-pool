interface TaskHandle {
    promise: Promise<any>,
    resolve: Function,
    reject: Function
}

class Thread {
    private handles: TaskHandle[] = [];
    private runningTasks = new Set();
    private threadNum;

    constructor({threadNum = 5} = {}) {
        this.threadNum = threadNum;
    }

    async run(task: Function) {
        let handle: TaskHandle = {promise: null, resolve: null, reject: null};
        handle.promise = new Promise((resolve, reject) => Object.assign(handle, {resolve, reject}))
        handle.promise = handle.promise.then(() => task())
        this.handles.push(handle);

        await this.exec().catch(e => null);
        return handle.promise;
    }

    private async exec() {
        if (this.runningTasks.size < this.threadNum && this.handles.length) {
            let handle = this.handles.shift();
            this.runningTasks.add(handle);
            handle.resolve();
            handle.promise
                .catch(() => null)
                .then(() => {
                    this.runningTasks.delete(handle);
                    this.exec()
                })
                .catch(() => null)
        }
    }

    getRunningCount() {
        return this.runningTasks.size
    }

    getHandleCount() {
        return this.handles.length
    }
}

export default Thread;

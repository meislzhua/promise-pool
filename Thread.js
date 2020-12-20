"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Thread = void 0;
class Thread {
    constructor({ threadCount = 5 } = {}) {
        this.handles = [];
        this.runningTasks = new Set();
        this.finishHandles = [];
        this.threadCount = threadCount;
    }
    getHandle() {
        let handle = { promise: null, resolve: null, reject: null };
        handle.promise = new Promise((resolve, reject) => Object.assign(handle, { resolve, reject }));
        return handle;
    }
    async exec() {
        if (!this.runningTasks.size && !this.handles.length) {
            for (let handle = this.finishHandles.pop(); handle; handle = this.finishHandles.pop()) {
                handle.resolve();
            }
        }
        if (this.runningTasks.size < this.threadCount && this.handles.length) {
            let handle = this.handles.shift();
            this.runningTasks.add(handle);
            handle.resolve();
            handle.promise
                .catch(() => null)
                .then(() => {
                this.runningTasks.delete(handle);
                this.exec();
            })
                .catch(() => null);
        }
    }
    async run(task) {
        let handle = this.getHandle();
        handle.promise = handle.promise.then(() => task());
        this.handles.push(handle);
        await this.exec().catch(e => null);
        return handle.promise;
    }
    getRunningCount() {
        return this.runningTasks.size;
    }
    getHandleCount() {
        return this.handles.length;
    }
    count() {
        return this.getHandleCount() + this.getRunningCount();
    }
    isFinish() {
        return !this.runningTasks.size;
    }
    async finish() {
        let handle = this.getHandle();
        this.finishHandles.push(handle);
        this.exec().catch(() => null);
        return handle.promise;
    }
}
exports.Thread = Thread;
exports.default = Thread;
//# sourceMappingURL=Thread.js.map
import { ClientEventOnce, Fn1 } from "guifast_shared";

export class EventOnce<T> implements ClientEventOnce<T> {
    private handlers: Array<Fn1<void, T>> = [];

    public add(callback: Fn1<void, T>) {
        this.handlers.push(callback);
    }

    public call(value: T) {
        const handlers = this.handlers;
        this.handlers = new Array<Fn1<void, T>>();
        for (const handler of handlers) {
            handler(value);
        }
    }
}

import * as Guifast from "guifast_shared";

export class EventOnce<T> implements Guifast.ClientEventOnce<T> {
    private handlers: Array<Guifast.Fn1<void, T>> = [];

    public add(callback: Guifast.Fn1<void, T>) {
        this.handlers.push(callback);
    }

    public call(value: T) {
        const handlers = this.handlers;
        this.handlers = new Array<Guifast.Fn1<void, T>>();
        for (const handler of handlers) {
            handler(value);
        }
    }
}

import { Fn1 } from "guifast_shared";

export class EventDecay<T> {
    private handlers: Fn1<void, T>[];
    private count: number;

    public constructor(handlers: Fn1<void, T>[], count: number = 1) {
        this.handlers = handlers;
        this.count = count;
    }

    public decay(data: T) {
        this.count = this.count - 1;

        if (this.count != 0) {
            return;
        }

        for (const handler of this.handlers) {
            if (handler !== undefined) {
                handler(data);
            }
        }

        this.handlers = [];
    }
}

import * as Guifast from "guifast_shared";

export interface ClientEvent<T> {
    add(callback: Guifast.Fn1<void, T>): number;
    remove(eventHandlerId: number): void;
}

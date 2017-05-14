import { Fn1 } from "guifast_shared";

export interface ClientEvent<T> {
    add(callback: Fn1<void, T>): number;
    remove(eventHandlerId: number): void;
}

import { Fn1 } from "guifast_shared";

export interface ClientEventOnce<T> {
    add(callback: Fn1<void, T>): void;
}

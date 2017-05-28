import * as Guifast from "guifast_shared";

export interface ClientEventOnce<T> {
    add(callback: Guifast.Fn1<void, T>): void;
}

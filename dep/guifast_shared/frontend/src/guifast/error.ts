import { Fn1 } from "guifast_shared";

let errorInternal: Fn1<void, string> | undefined;
export const error = (message: string) => {
    if (errorInternal !== undefined) {
        errorInternal(message);
    } else {
        console.log("Tried to call error() but it is not yet set. error() was called with:\n" + message);
    }
};
export const setError = (fn: Fn1<void, string>) => { errorInternal = fn; };
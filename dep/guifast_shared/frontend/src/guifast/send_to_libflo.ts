import { Action, error, Fn1 } from "guifast_shared";

let sendToLibfloInternal: Fn1<void, Action> | undefined;
export const sendToLibflo = (action: Action) => {
    if (sendToLibfloInternal !== undefined) {
        sendToLibfloInternal(action);
    } else {
        error("Tried to call sendToLibflo() but it is not yet set. sendToLibflo() was called with:\n" + action);
    }
};
export const setSendToLibflo = (fn: Fn1<void, Action>) => { sendToLibfloInternal = fn; };

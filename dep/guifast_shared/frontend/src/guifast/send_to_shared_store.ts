import { Action, error, Fn1 } from "guifast_shared";

let sendToSharedStoreInternal: Fn1<void, Action> | undefined;
export const sendToSharedStore = (action: Action) => {
    if (sendToSharedStoreInternal !== undefined) {
        sendToSharedStoreInternal(action);
    } else {
        error("Tried to call sendToSharedStore() but it is not yet set. sendToSharedStore() was called with:\n" + action);
    }
};
export const setSendToSharedStore = (fn: Fn1<void, Action>) => { sendToSharedStoreInternal = fn; };

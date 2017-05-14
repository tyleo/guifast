import { Action, error, Fn2 } from "guifast_shared";

let sendToStoreInternal: Fn2<void, Action, number | undefined> | undefined;
export const sendToStore = (action: Action, storeId: number | undefined) => {
    if (sendToStoreInternal !== undefined) {
        sendToStoreInternal(action, storeId);
    } else {
        error("Tried to call sendToStore() but it is not yet set. sendToStore() was called on store " + storeId + " with:\n" + action);
    }
};
export const setSendToStore = (fn: Fn2<void, Action, number | undefined>) => { sendToStoreInternal = fn; };

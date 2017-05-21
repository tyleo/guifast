import * as Guifast from "guifast_shared";

let sendToMainInternal: Guifast.Fn1<void, Guifast.Action> | undefined;
export const sendToMain = (action: Guifast.Action) => {
    if (sendToMainInternal !== undefined) {
        sendToMainInternal(action);
    } else {
        Guifast.error("Tried to call sendToMain() but it is not yet set. sendToMain() was called with:\n" + action);
    }
};
export const setSendToMain = (fn: Guifast.Fn1<void, Guifast.Action>) => { sendToMainInternal = fn; };

import * as Guifast from "guifast_shared";

let sendToLibfloInternal: Guifast.Fn1<void, Guifast.Action> | undefined;
export const sendToLibflo = (action: Guifast.Action) => {
    if (sendToLibfloInternal !== undefined) {
        sendToLibfloInternal(action);
    } else {
        Guifast.error("Tried to call sendToLibflo() but it is not yet set. sendToLibflo() was called with:\n" + action);
    }
};
export const setSendToLibflo = (fn: Guifast.Fn1<void, Guifast.Action>) => { sendToLibfloInternal = fn; };

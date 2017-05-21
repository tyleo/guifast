import * as Guifast from "guifast_shared";

let sendToSharedRendererInternal: Guifast.Fn1<void, Guifast.Action> | undefined;
export const sendToSharedRenderer = (action: Guifast.Action) => {
    if (sendToSharedRendererInternal !== undefined) {
        sendToSharedRendererInternal(action);
    } else {
        Guifast.error("Tried to call sendToSharedRenderer() but it is not yet set. sendToSharedRenderer() was called with:\n" + action);
    }
};
export const setSendToSharedRenderer = (fn: Guifast.Fn1<void, Guifast.Action>) => { sendToSharedRendererInternal = fn; };

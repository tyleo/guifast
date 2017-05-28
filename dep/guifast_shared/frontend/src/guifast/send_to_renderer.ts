import * as Guifast from "guifast_shared";

let sendToRendererInternal: Guifast.Fn2<void, Guifast.Action, number | undefined> | undefined;
export const sendToRenderer = (action: Guifast.Action, storeId: number | undefined = undefined) => {
    if (sendToRendererInternal !== undefined) {
        sendToRendererInternal(action, storeId);
    } else {
        Guifast.error("Tried to call sendToRenderer() but it is not yet set. sendToRenderer() was called on store " + storeId + " with:\n" + action);
    }
};
export const setSendToRenderer = (fn: Guifast.Fn2<void, Guifast.Action, number | undefined>) => { sendToRendererInternal = fn; };

import { Action, error, Fn1 } from "guifast_shared";

let sendToGuifastInternal: Fn1<void, Action> | undefined;
export const sendToGuifast = (action: Action) => {
    if (sendToGuifastInternal !== undefined) {
        sendToGuifastInternal(action);
    } else {
        error("Tried to call sendToGuifast() but it is not yet set. sendToGuifast() was called with:\n" + action);
    }
};
export const setSendToGuifast = (fn: Fn1<void, Action>) => { sendToGuifastInternal = fn; };

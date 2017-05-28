import * as Guifast from "guifast_shared";
import * as GuifastMain from "guifast/main";

let rootMainState = GuifastMain.rootMainReducer(undefined, undefined);

export const getRootMainState = () => { return rootMainState; };

export const setRootMainState = (value: GuifastMain.GuifastMainState) => { rootMainState = value; }

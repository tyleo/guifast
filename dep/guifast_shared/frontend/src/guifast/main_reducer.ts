import { Action, Fn3, ModuleState, State } from "guifast_shared";

export type MainReducer = Fn3<void, ModuleState, Action | undefined, State>;

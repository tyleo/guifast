import { Action, Fn3, ModuleState, State } from "guifast_shared";

// A ModuleReducer must at least return a ModuleState but the ModuleState can have extra properties on it.
export type ModuleReducer = Fn3<ModuleState, ModuleState, Action | undefined, State>;

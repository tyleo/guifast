import * as Guifast from "guifast_shared";

// A RendererReducer must at least return a ModuleState but the ModuleState can have extra properties on it.
export type RendererReducer = Guifast.Fn3<Guifast.RendererState, Guifast.RendererState, Guifast.Action | undefined, Guifast.RootRendererState>;

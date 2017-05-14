import { ModuleState } from "guifast_shared";
import { CommandWindowState } from "guifast/client/state";

export interface GuifastState extends ModuleState {
    readonly commandWindowState: CommandWindowState;
}

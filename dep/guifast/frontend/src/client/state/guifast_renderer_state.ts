import { RendererState } from "guifast_shared";
import { CommandWindowState } from "guifast/client/state";

export interface GuifastRendererState extends RendererState {
    readonly commandWindowState: CommandWindowState;
}

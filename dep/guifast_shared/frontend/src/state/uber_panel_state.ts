import * as Guifast from "guifast_shared";

export interface UberPanelState {
    readonly component?: Guifast.RequireInfo;
    readonly children: Array<number>;
    readonly id: number;
}

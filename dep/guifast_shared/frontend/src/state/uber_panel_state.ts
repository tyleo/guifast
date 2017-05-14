import { RequireInfo } from "guifast_shared";

export interface UberPanelState {
    readonly component?: RequireInfo;
    readonly children: Array<number>;
    readonly id: number;
}

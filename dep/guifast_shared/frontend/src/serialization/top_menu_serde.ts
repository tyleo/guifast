import * as Guifast from "guifast_shared";

export interface TopMenuSerde {
    readonly action: Guifast.BasicActionSerde | null;
    readonly label: string;
    readonly submenu: Array<TopMenuSerde> | null;
}

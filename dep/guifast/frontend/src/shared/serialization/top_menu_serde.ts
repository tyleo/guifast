import * as GuifastShared from "guifast/shared";

export interface TopMenuSerde {
    readonly action: GuifastShared.BasicActionSerde | null;
    readonly label: string;
    readonly submenu: Array<TopMenuSerde> | null;
}

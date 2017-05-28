import * as GuifastShared from "guifast/shared";

export interface ModuleSerde {
    readonly components: Array<GuifastShared.ComponentSerde>;
    readonly menu: Array<GuifastShared.TopMenuSerde> | null;
    readonly name: string;
    readonly main_reducer: GuifastShared.RequireInfoSerde | null;
    readonly renderer_reducer: GuifastShared.RequireInfoSerde | null;
    readonly startup_windows: Array<string> | null;
}

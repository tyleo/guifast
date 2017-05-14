import { ComponentSerde, RequireInfoSerde, TopMenuSerde } from "guifast_shared";

export interface ModuleSerde {
    readonly components: Array<ComponentSerde>;
    readonly menu: Array<TopMenuSerde> | null;
    readonly name: string;
    readonly main_reducer: RequireInfoSerde | null;
    readonly renderer_reducer: RequireInfoSerde | null;
    readonly startup_windows: Array<string> | null;
}

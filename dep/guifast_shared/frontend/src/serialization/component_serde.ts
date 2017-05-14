import { RequireInfoSerde } from "guifast_shared";

export interface ComponentSerde {
    readonly require_info: RequireInfoSerde;
    readonly name: string;
}

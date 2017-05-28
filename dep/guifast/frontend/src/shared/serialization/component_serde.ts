import * as GuifastShared from "guifast/shared";

export interface ComponentSerde {
    readonly require_info: GuifastShared.RequireInfoSerde;
    readonly name: string;
}

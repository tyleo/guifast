import { RequireInfo } from "guifast_shared";

export function fromRequireInfo<T>(value: RequireInfo): T {
    return require(value.path)[value.name] as T;
};

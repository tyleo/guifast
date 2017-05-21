import * as Guifast from "guifast_shared";

export function fromRequireInfo<T>(value: Guifast.RequireInfo): T {
    return require(value.path)[value.name] as T;
};

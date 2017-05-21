import * as Guifast from "guifast_shared";

export function mapNumberOrString<T>(
    numberOrString: Guifast.NumberOrString,
    numberFn: Guifast.Fn1<T, number>,
    stringFn: Guifast.Fn1<T, string>
): T {
    if (typeof numberOrString === "string") {
        return stringFn(numberOrString);
    } else {
        return numberFn(numberOrString);
    }
}

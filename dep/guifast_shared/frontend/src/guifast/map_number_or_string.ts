import { Fn1, NumberOrString } from "guifast_shared";

export function mapNumberOrString<T>(
    numberOrString: NumberOrString,
    numberFn: Fn1<T, number>,
    stringFn: Fn1<T, string>
): T {
    if (typeof numberOrString === "string") {
        return stringFn(numberOrString);
    } else {
        return numberFn(numberOrString);
    }
}

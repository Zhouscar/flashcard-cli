import { MyCard } from "./cards";

type S = "cards" | "relations" | keyof MyCard;

export function s(theS: S): string {
    return theS;
}

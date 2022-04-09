import { TokenType } from "./markup.js";
export interface Interpolation {
    type: "interpolation";
    value: any;
}
export interface Token {
    type: TokenType;
    value: string | undefined;
}
export interface State {
    (context: ParseContext): State;
}
export interface Element {
    type: unknown;
    props: Record<string, any>;
    children: Array<Child>;
}
export declare type Child = string | number | null | undefined | boolean | Element | Array<Child>;
export interface ParseContext {
    stack: Array<Element>;
    state: State;
    attribute: string | undefined;
    tag: Element;
    closeMarker: boolean;
    token: Token | Interpolation;
}

import { Schema } from "fsm-tokenizer";
export declare const schema: Schema<"name" | "text" | "closeMarker" | "equals" | "escape" | "quote" | "tagCloser" | "tagOpener" | "value", "name" | "text" | "closeMarker" | "tagCloser" | "tagOpener" | "value" | "textEscape" | "textEscaped" | "nameOrClose" | "equalsOrName" | "openingQuoteOrName" | "valueEscape" | "closingQuote" | "valueEscaped">;
export declare type TokenType = typeof schema extends Schema<infer T, any> ? T : never;
export declare function markup(strings: TemplateStringsArray, ...values: Array<any>): import("./types.js").Child[];

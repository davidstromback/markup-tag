import { parse } from "./parse.js";
import { interpolate } from "./interpolate.js";
import { compile, tokenizer, memo } from "fsm-tokenizer";
export const schema = compile({
    initialState: "text",
    tokens: {
        closeMarker: {},
        equals: {},
        escape: {},
        name: { value: true },
        quote: {},
        tagCloser: {},
        tagOpener: {},
        text: { value: true },
        value: { value: true, padding: true },
    },
    states: {
        text: {
            token: "text",
            rules: [
                [/\\/, "before", "textEscape", true],
                [/</, "before", "tagOpener", true],
                [/[\s\S]/, "after", "text", false],
            ],
        },
        textEscape: {
            token: "escape",
            rules: [[/\\/, "after", "textEscaped", true]],
        },
        textEscaped: {
            token: "text",
            rules: [[/[\s\S]/, "after", "text", false]],
        },
        tagOpener: {
            token: "tagOpener",
            rules: [[/</, "after", "nameOrClose", true]],
        },
        closeMarker: {
            token: "closeMarker",
            rules: [[/\//, "after", "nameOrClose", true]],
        },
        nameOrClose: {
            token: "name",
            rules: [
                [/\s/, "after", "nameOrClose", false],
                [/[a-zA-Z]/, "before", "name", true],
                [/\//, "before", "closeMarker", true],
                [/>/, "before", "tagCloser", true],
            ],
        },
        name: {
            token: "name",
            rules: [
                [/[a-zA-Z0-9]/, "after", "name", false],
                [/\s/, "before", "nameOrClose", true],
                [/>/, "before", "tagCloser", true],
                [/\//, "before", "closeMarker", true],
                [/=/, "before", "equalsOrName", true],
            ],
        },
        equalsOrName: {
            token: "equals",
            rules: [
                [/\s/, "after", "equalsOrName", false],
                [/=/, "after", "openingQuoteOrName", true],
                [/\//, "before", "closeMarker", true],
                [/>/, "before", "tagCloser", true],
                [/[a-zA-Z]/, "before", "nameOrClose", true],
            ],
        },
        openingQuoteOrName: {
            token: "quote",
            rules: [
                [/\s/, "after", "openingQuoteOrName", false],
                [/"/, "after", "value", true],
                [/\//, "before", "closeMarker", true],
                [/>/, "before", "tagCloser", true],
                [/[a-zA-Z]/, "before", "nameOrClose", true],
            ],
        },
        value: {
            token: "value",
            rules: [
                [/\\/, "before", "valueEscape", true],
                [/"/, "before", "closingQuote", true],
                [/[\s\S]/, "after", "value", false],
            ],
        },
        valueEscape: {
            token: "escape",
            rules: [[/\\/, "after", "valueEscaped", true]],
        },
        valueEscaped: {
            token: "value",
            rules: [[/[\s\S]/, "after", "value", false]],
        },
        closingQuote: {
            token: "quote",
            rules: [[/"/, "after", "nameOrClose", true]],
        },
        tagCloser: {
            token: "tagCloser",
            rules: [[/>/, "after", "text", true]],
        },
    },
});
const tokenize = memo(tokenizer(schema, (type, value) => ({ type, value })));
export function markup(strings, ...values) {
    return parse(interpolate(tokenize, strings, values));
}

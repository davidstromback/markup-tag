import { bodyOrTagOpener } from "./state.js";
export function parse(tokens) {
    const root = { type: "", props: {}, children: [] };
    const context = {
        attribute: undefined,
        closeMarker: false,
        stack: [root],
        state: bodyOrTagOpener,
        tag: { type: "", props: {}, children: [] },
        token: { type: "text", value: undefined },
    };
    for (const token of tokens) {
        context.token = token;
        context.state = context.state(context);
    }
    const element = context.stack.pop();
    if (context.stack.length !== 0 || element !== root) {
        throw new Error(`Expected closing tag for ${element === null || element === void 0 ? void 0 : element.type}.`);
    }
    return element.children;
}

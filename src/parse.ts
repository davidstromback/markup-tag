import { bodyOrTagOpener } from "./state.js";
import { Token, Interpolation, ParseContext } from "./types.js";

export function parse(tokens: Iterable<Token | Interpolation>) {
  const root = { type: "", props: {}, children: [] };

  const context: ParseContext = {
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
    throw new Error(`Expected closing tag for ${element?.type}.`);
  }

  return element.children;
}

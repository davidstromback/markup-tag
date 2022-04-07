import type { Element, ParseContext } from "./types.js";

export function getStackTrace(context: ParseContext) {
  return context.stack
    .slice(1)
    .reverse()
    .map((frame) => `\n  in ${getDisplayName(frame.type)}`);
}

function invalidOpeningTagMessage(context: ParseContext, type: any) {
  return (
    `Invalid tag ${type}, expected string, function or object.` +
    getStackTrace(context)
  );
}

function invalidClosingTagMessage(
  context: ParseContext,
  actual: any,
  expected: any
) {
  return (
    `Invalid closing tag "${getDisplayName(actual)}", ` +
    `expected ${getDisplayName(expected)}.` +
    getStackTrace(context)
  );
}

function unexpectedClosingTagMessage(context: ParseContext, type: any) {
  return (
    `Unexpected closing tag "${getDisplayName(type)}".` + getStackTrace(context)
  );
}

function invalidSpreadValueMessage(context: ParseContext) {
  return `Spread values must be of type object.${getStackTrace(context)}`;
}

function writeChildren(
  context: ParseContext,
  ...children: Array<Element | string>
) {
  context.stack[context.stack.length - 1].children.push(...children);
}

export function writeTextChild(
  context: ParseContext,
  value: string | undefined
) {
  if (value) {
    writeChildren(context, value);
  }
}

export function writeInterpolatedChildren(context: ParseContext, value: any) {
  if (typeof value !== "boolean" && value != null) {
    if (Array.isArray(value)) {
      for (const child of value) {
        writeInterpolatedChildren(context, child);
      }
    } else {
      writeChildren(context, value);
    }
  }
}

export function writeAttribute(context: ParseContext, value: any) {
  if (context.attribute) {
    context.tag.props[context.attribute] = value;
  }

  context.attribute = undefined;
}

export function writeSpreadAttribute(context: ParseContext, value: any) {
  if (typeof value != null) {
    if (typeof value !== "object" || Array.isArray(value)) {
      throw new Error(invalidSpreadValueMessage(context));
    }

    Object.assign(context.tag.props, value);
  }
}

export function startAttribute(
  context: ParseContext,
  name: string | undefined
) {
  if (context.attribute) {
    writeAttribute(context, true);
  }

  context.attribute = name;
}

export function getDisplayName(tag: any) {
  if (typeof tag === "string") {
    return tag;
  }

  if (typeof tag === "function" && tag.name) {
    return tag.name;
  }

  return typeof tag;
}

export function closeElement(context: ParseContext, type: any) {
  const element = context.stack.pop();

  if (!element) {
    throw new Error(unexpectedClosingTagMessage(context, type));
  }

  if (element.type !== type) {
    throw new Error(invalidClosingTagMessage(context, type, element.type));
  }

  context.stack[context.stack.length - 1].children.push(element);

  return element;
}

export function startTag(context: ParseContext, type: any) {
  if (context.closeMarker) {
    context.tag = closeElement(context, type);
  } else {
    if (
      typeof type !== "string" &&
      typeof type !== "function" &&
      (typeof type !== "object" || Array.isArray(type))
    ) {
      throw new Error(invalidOpeningTagMessage(context, type));
    }

    context.tag = { type, props: {}, children: [] };
    context.stack.push(context.tag);
  }
}

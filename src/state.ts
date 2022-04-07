import { State, ParseContext } from "./types.js";

import {
  writeAttribute,
  startAttribute,
  startTag,
  writeTextChild,
  writeInterpolatedChildren,
  writeSpreadAttribute,
  closeElement,
  getStackTrace,
} from "./context.js";

function invalidMessage(context: ParseContext, expected: string): string {
  return (
    `Invalid token "${context.token.type}" ` +
    `expected ${expected}.` +
    getStackTrace(context)
  );
}

export const bodyOrTagOpener: State = function bodyOrTagOpener(context) {
  if (context.token.type === 'text') {
    writeTextChild(context, context.token.value);

    return bodyOrTagOpener;
  }

  if (context.token.type === 'interpolation') {
    writeInterpolatedChildren(context, context.token.value);

    return bodyOrTagOpener;
  }

  if (context.token.type === 'tagOpener') {
    return closeMarkerOrTagName;
  }

  throw new Error(invalidMessage(context, "text, children or tag opener (<)"));
};

export const closeMarkerOrTagName: State = function closeMarkerOrTagName(
  context
) {
  if (context.token.type === 'closeMarker') {
    context.closeMarker = true;

    return tagNameOrTagCloser;
  }

  context.closeMarker = false;

  return tagNameOrTagCloser(context);
};

export const tagNameOrTagCloser: State = function tagNameOrTagCloser(context) {
  if (context.token.type === 'name' || context.token.type === 'interpolation') {
    startTag(context, context.token.value);

    return attributeName;
  }

  if (context.token.type === 'tagCloser') {
    startTag(context, undefined);

    return bodyOrTagOpener;
  }

  throw new Error(invalidMessage(context, "tag name or tag closer (>)"));
};

export const attributeName: State = function attributeName(context) {
  if (context.token.type === 'name') {
    startAttribute(context, context.token.value);

    return attributeName;
  }

  if (context.token.type === 'interpolation') {
    writeSpreadAttribute(context, context.token.value);

    return attributeName;
  }

  if (context.token.type === 'tagCloser') {
    return bodyOrTagOpener;
  }

  if (context.token.type === 'closeMarker' && !context.closeMarker) {
    closeElement(context, context.tag.type);

    return tagCloser;
  }

  if (context.token.type === 'equals' && context.attribute) {
    return quouteOrInterpolation;
  }

  throw new Error(invalidMessage(context, "attribute name or tag closer (>)"));
};

export const quouteOrInterpolation: State = function quouteOrInterpolation(
  context
) {
  if (context.token.type === 'quote') {
    return valueOrQuote;
  }

  if (context.token.type === 'interpolation') {
    writeAttribute(context, context.token.value);

    return attributeName;
  }

  throw new Error(
    invalidMessage(context, 'opening quotation mark (") or value')
  );
};

export const valueOrQuote: State = function valueOrQuote(context) {
  if (context.token.type === 'value') {
    writeAttribute(context, context.token.value);

    return quote;
  }

  if (context.token.type === 'quote') {
    writeAttribute(context, "");

    return attributeName;
  }

  throw new Error(
    invalidMessage(context, 'value or closing quotation mark (")')
  );
};

export const quote: State = function quote(context) {
  if (context.token.type === 'quote') {
    return attributeName;
  }

  throw new Error(invalidMessage(context, 'closing quotation mark (")'));
};

export const tagCloser: State = function tagCloser(context) {
  if (context.token.type === 'tagCloser') {
    return bodyOrTagOpener;
  }

  throw new Error(invalidMessage(context, "tag closer (>)"));
};

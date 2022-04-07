import { tokenizer } from "fsm-tokenizer";
import { schema } from "./markup.js";
import { parse } from "./parse.js";

describe("parse", () => {
  describe("matches snapshots", () => {
    const cases = [
      "<foobar />",
      '<foo bar="foo" />',
      "<foo>Hello world</foo>",
      "<foo><foobar /></foo>",
    ];

    test.each(cases)("%p", (string) => {
      const tokenize = tokenizer(schema);
      expect(parse(tokenize(string))).toMatchSnapshot();
    });
  });

  /*
  describe("throws errors matching snapshots", () => {
    const cases: string[] = [];

    test.each(cases)("%p", (string) => {
      expect(parse(string)).toThrowErrorMatchingSnapshot();
    });
  });
  */
});

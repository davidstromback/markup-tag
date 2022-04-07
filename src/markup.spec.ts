/* eslint-disable no-template-curly-in-string */

import { markup } from "./markup.js";

describe("markup", () => {
  describe("matches snapshots", () => {
    test('<foo foo="bar" />', () => {
      expect(markup`<foo foo="bar" />`).toMatchSnapshot();
    });

    const MyComponent = () => "foo";

    const todos = ["buy milk", "git gud"];

    test("<foo attribute=${'value'} />", () => {
      expect(
        markup`
            <${"tagName"} attribute=${"value"} ${{ foo: "bar" }}>
                <div>
                child0
                ${["child1", "child2"]}
                child3
                <${MyComponent} foo="">
                    Test
                    ${todos}
                    ${todos.map((todo) => markup`<div>${todo}</div>`)}
                </${MyComponent}>
                <div />
                </div>
            </${"tagName"}>
        `
      ).toMatchSnapshot();
    });
  });
});

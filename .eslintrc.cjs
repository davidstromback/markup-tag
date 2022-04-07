module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:import/recommended", "standard", "prettier"],
  plugins: [],
  rules: {
    "import/no-unresolved": 0,
    "no-debugger": 1,
  },
  overrides: [
    {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      settings: {
        "import/parsers": { "@typescript-eslint/parser": [".ts"] },
      },
      files: ["*.ts"],
      extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/typescript",
      ],
      plugins: ["@typescript-eslint"],
      rules: {
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/no-empty-interface": 0,
        "@typescript-eslint/ban-types": 0,
        "@typescript-eslint/no-redeclare": 2,
        "@typescript-eslint/no-unused-vars": [1, { ignoreRestSiblings: true }],
        "import/extensions": [2, "ignorePackages"],
        "no-redeclare": 0,
        "no-undef": 0,
        "no-use-before-define": 0,
        "react/prop-types": 0,
      },
    },
  ],
};

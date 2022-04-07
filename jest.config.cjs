/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  extensionsToTreatAsEsm: [".ts"],
  globals: { "ts-jest": { useESM: true, tsconfig: "tsconfig.jest.json" } },
  moduleNameMapper: { "(.+)\\.js": "$1" },
  preset: "ts-jest/presets/js-with-ts-esm",
  rootDir: "src",
  testEnvironment: "node",
  testMatch: ["**/?(*.)+(spec).[jt]s?(x)"],
};

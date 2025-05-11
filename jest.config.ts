import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest", // use ts-jest for TS
  testEnvironment: "jsdom", // browser-like environment
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|scss|svg)$": "<rootDir>/__mocks__/styleMock.js",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
  testMatch: ["**/?(*.)+(test).[jt]s?(x)"],
};

export default config;

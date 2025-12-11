module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.spec.ts", "**/__tests__/**/*.test.ts"],
  testPathIgnorePatterns: ["/node_modules/"],
  moduleNameMapper: {
    "^@domain/(.*)$": "<rootDir>/src/domain/$1",
    "^@use-cases/(.*)$": "<rootDir>/src/use-cases/$1",
    "^@infra/(.*)$": "<rootDir>/src/infra/$1",
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
  },
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
};

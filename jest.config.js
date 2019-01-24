module.exports = {
  moduleNameMapper: {
    "\\.(css|less|scss)$": "<rootDir>/test/styleMock.ts",
    "env/Config": "<rootDir>/assets/env/test/Config.ts",
  },
  reporters: ["default", "jest-stare"],
  collectCoverageFrom : ["assets/**/*.ts","assets/**/*.tsx"],
  coverageDirectory: "<rootDir>/test/output/coverage",
  coverageReporters: ["html", "clover"],
  coveragePathIgnorePatterns: [
    "<rootDir>/assets/env/",
    "<rootDir>/assets/Enum/",
    "<rootDir>/bin/",
    "<rootDir>/build/",
    "<rootDir>/config/",
    "<rootDir>/coverage/",
    "<rootDir>/infrastructure/",
    "<rootDir>/node_modules/",
    "<rootDir>/public/",
    "<rootDir>/src/",
    "<rootDir>/templates/",
    "<rootDir>/test/",
    "<rootDir>/var/",
    "<rootDir>/vendor/",
  ],
  preset: 'ts-jest',
  roots: ['<rootDir>/assets'],
  testEnvironment: 'jsdom',
  testMatch: ['**/*.test.ts', '**/*.test.jsx'],
};
module.exports = {
  moduleNameMapper: {"\\.(css|less|scss)$": "<rootDir>/test/styleMock.ts"},
  reporters: ["default", "jest-stare"],
  coverageDirectory: "<rootDir>/test/output/coverage",
  coverageReporters: ["html", "clover"],
  coveragePathIgnorePatterns: [
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
  testMatch: ['**/*.test.ts', '**/*.test.jsx']
};
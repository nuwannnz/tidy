{
  "testMatch": ["**/*.spec.ts", "**/*.test.ts"],
  "collectCoverage": true,
  "coverageReporters": ["text", "lcov", "html"],
  "coverageDirectory": "coverage",
  "coverageThreshold": {
    "global": {
      "branches": 70,
      "functions": 70,
      "lines": 70,
      "statements": 70
    }
  }
}

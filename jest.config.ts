module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/test_cases/**/*"],
  transform: {
    "^.+\\.(js|ts)$": "ts-jest",
  }
};

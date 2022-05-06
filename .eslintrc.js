module.exports = {
  extends: ["welly"],
  rules: {
    camelcase: "off",
    "no-console": [
      "warn",
      {
        allow: ["warn", "error"],
      },
    ],
    "testing-library/render-result-naming-convention": "off",
  },
};

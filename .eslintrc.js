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
    "@typescript-eslint/camelcase": "off",
  },
};

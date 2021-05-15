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
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/camelcase": "off",
    "testing-library/render-result-naming-convention": "off",
  },
};

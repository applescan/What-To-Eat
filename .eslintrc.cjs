// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

/** @type {import("eslint").Linter.Config} */
const config = {
  overrides: [
    {
      extends: [
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        project: path.join(__dirname, "tsconfig.json"),
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: path.join(__dirname, "tsconfig.json"),
  },
  plugins: ["@typescript-eslint"],
  extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
  "rules": {
    "no-console": "off",
    "no-unused-vars": "off",
    "no-undef": "off",
    "no-redeclare": "off",
    "no-extra-semi": "off",
    "no-empty": "off",
    "no-mixed-spaces-and-tabs": "off",
    "no-trailing-spaces": "off",
    "quotes": "off",
    "semi": "off"
  }
};

module.exports = config;

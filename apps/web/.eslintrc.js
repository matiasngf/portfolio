module.exports = {
  root: true,
  extends: [
    "next/core-web-vitals",
    "eslint-config-custom"
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-types": "off",
  }
};

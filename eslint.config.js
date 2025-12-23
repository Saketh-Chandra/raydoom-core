const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { 
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_" 
        }
      ],
    },
  },
  {
    ignores: ["dist/**", "node_modules/**", "src/doom-ascii/**", "*.js"],
  },
]);

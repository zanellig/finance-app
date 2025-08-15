import * as js from "@eslint/js";
import * as globals from "globals";
import * as tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    ignores: ["src/utils/clerk-errors.ts", "eslint.config.mts"],
  },
];

import js from "@eslint/js";
import baseConfig from "@hono/eslint-config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...baseConfig,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: globals.node,
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: ".",
      },
    },
  },
  {
    files: ["**/*.{ts,mts,cts}"],
    plugins: {
      drizzle: (await import("eslint-plugin-drizzle")).default,
    },
    rules: {
      // All recommended drizzle rules (equivalent to 'all' config)
      "drizzle/enforce-delete-with-where": [
        "error",
        { drizzleObjectName: ["db"] },
      ],
      "drizzle/enforce-update-with-where": [
        "error",
        { drizzleObjectName: ["db"] },
      ],
      "@typescript-eslint/require-await": "off",
    },
  },
  {
    ignores: ["src/utils/clerk-errors.ts", "eslint.config.js"],
  },
];

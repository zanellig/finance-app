import type { Config } from 'prettier'
module.exports = {
  importOrder: [
    "^(react/(.*)$)|^(react$)",
    "^(hono/(.*)$)|^(hono$)",
    "^(drizzle-orm/(.*)$)|^(drizzle-orm$)",
    "^(@tanstack/react-router/(.*)$)|^(@tanstack/react-router$)",
    "^(@tanstack/(.*)$)|^(@tanstack$)",
    "",
    "<THIRD_PARTY_MODULES>",
    "",
    "^types$",
    "^@/controllers/(.*)$",
    "^@/models/(.*)$",
    "^@/dtos/(.*)$",
    "^@/services/(.*)$",
    "^@/components/(.*)$",
    "",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
} satisfies Config;

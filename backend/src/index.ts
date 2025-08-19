import { serve } from "bun";
import { env } from "@/config/env";

import app from "@/app";

const port = env.PORT || 3000;

serve({
  fetch: app.fetch,
  port,
  hostname: "0.0.0.0",
});

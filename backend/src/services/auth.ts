import { env } from "@/config/env";
import { createClerkClient } from "@clerk/backend";

const authService = createClerkClient({
  secretKey: env.CLERK_SECRET_KEY,
  publishableKey: env.CLERK_PUBLISHABLE_KEY,
});

export default authService;

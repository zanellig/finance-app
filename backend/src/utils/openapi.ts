import { AppOpenAPI } from "@/types/hono";
import packageJSON from "@/../package.json";
import { Scalar } from "@scalar/hono-api-reference";

export default function configureOpenAPI(app: AppOpenAPI) {
  // Define OpenAPI schema for the app
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      title: "Finance Tracker API",
      version: packageJSON.version,
    },
  });

  app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
    type: "http",
    scheme: "bearer",
    description: "Enter your JWT token in the format: Bearer <token>",
    bearerFormat: "JWT",
  });

  app.get(
    "/reference",
    Scalar({
      url: "/api/doc",
      theme: "kepler",
      defaultHttpClient: {
        targetKey: "javascript",
        clientKey: "fetch",
      },
      pageTitle: "API Reference",
    })
  );
}

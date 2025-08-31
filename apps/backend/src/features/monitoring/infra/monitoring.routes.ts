// monitoring.routes.ts
import { requireAuth } from "@infra/http/middleware/auth.middleware";
import { Hono } from "hono";
import { createMonitoringContext } from "./monitoring.composition";

// Import handlers here:
// import { createMonitoringHandler } from "../api/create-monitoring.handler";

export function createMonitoringRouter(): Hono {
  const router = new Hono();
  const context = createMonitoringContext();

  // Add your routes here:
  // router.post("/", (c) => createMonitoringHandler(c, context));
  // router.get("/:id", requireAuth, (c) => getMonitoringHandler(c, context));

  return router;
}

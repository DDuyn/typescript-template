import { env } from "@core/env/env";
import { serve } from "@hono/node-server";
import {
  monitoringMiddleware,
  requestIdMiddleware,
} from "@infra/http/middleware/monitoring.middleware";
import { api } from "@infra/http/routes/api";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();

app.use("*", logger());
app.use("*", monitoringMiddleware);
app.use("*", requestIdMiddleware);

app.use(
  "*",
  cors({
    origin: ["http://localhost:3001", "http://localhost:5173"],
    credentials: true,
  })
);

app.route("/api", api);

app.get("/healthcheck", (c) => {
  return c.json({
    ok: true,
    message: "Backend is running!",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.notFound((c) => {
  return c.json({ error: "Not Found", path: c.req.path }, 404);
});

app.onError((err, c) => {
  console.error("Unhandled error:", err);
  return c.json(
    {
      error: "Internal Server Error",
      message:
        env.NODE_ENV === "development" ? err.message : "Something went wrong",
    },
    500
  );
});

console.log(`🚀 Server starting on port ${env.APP_PORT}`);

serve({
  fetch: app.fetch,
  port: env.APP_PORT,
});

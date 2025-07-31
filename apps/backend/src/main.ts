import { env } from "@core/env/env";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { api } from "infra/http/routes/api";

const app = new Hono();

app.route("/api", api);
app.get("/healthcheck", (c) => {
  return c.json({
    ok: true,
    message: "Hello Hono!",
  });
});

serve({
  fetch: app.fetch,
  port: env.APP_PORT,
});

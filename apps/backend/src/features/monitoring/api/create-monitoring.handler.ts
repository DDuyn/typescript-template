// api/create-monitoring.handler.ts
import { isErr } from "@core/result/result";
import { Context } from "hono";
import { MonitoringContext } from "../domain/monitoring.context";
import { createMonitoringService } from "../domain/create-monitoring.service";
import { createMonitoringRequestSchema } from "./create-monitoring.request";

export const createMonitoringHandler = async (c: Context, context: MonitoringContext) => {
  const body = await c.req.json();
  const parseResult = createMonitoringRequestSchema.safeParse(body);

  if (!parseResult.success) {
    return c.json({ error: "Invalid request", details: parseResult.error }, 400);
  }

  const result = await createMonitoringService(parseResult.data, context);

  if (isErr(result)) {
    return c.json({ error: result.error }, 400);
  }

  return c.json(result.value, 201);
};

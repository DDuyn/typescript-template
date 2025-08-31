import {
  getLogger,
  getMetrics,
} from "@features/monitoring/infra/monitoring.composition";
import { randomUUID } from "crypto";
import { MiddlewareHandler } from "hono";

export const monitoringMiddleware: MiddlewareHandler = async (c, next) => {
  const startTime = Date.now();
  const method = c.req.method;
  const path = c.req.path;
  const userAgent = c.req.header("user-agent") || "unknown";

  const user = c.get("user");
  const userId = user?.userId;

  try {
    await next();

    const responseTime = Date.now() - startTime;
    const statusCode = c.res.status;

    const logger = getLogger();
    const metrics = getMetrics();
    await logger.logRequest(
      method,
      path,
      statusCode,
      responseTime,
      userId,
      userAgent
    );
    await metrics.metricRequest(method, path, statusCode, responseTime);
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const logger = getLogger();

    await logger.error(
      `
        Request failed: ${method} ${path}`,
      {
        error: error instanceof Error ? error.message : "unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        responseTime,
        userAgent,
      },
      userId,
      path
    );

    throw error;
  }
};

export const requestIdMiddleware: MiddlewareHandler = async (c, next) => {
  const requestId = randomUUID();
  c.set("requestId", requestId);
  c.res.headers.set("X-Request-Id", requestId);
  await next();
};

import { FeatureContext } from "@core/types/feature-context";
import { Context, Hono } from "hono";
import { requireAuth } from "../middleware/auth.middleware";

export type RouteDefinition = {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  handler: (c: Context, ...args: any[]) => Promise<Response> | Response;
  middleware?: any[];
  protected?: boolean;
};

export class RouteBuilder {
  static buildRoutes(routes: RouteDefinition[], context?: FeatureContext) {
    const router = new Hono();

    routes.forEach((route) => {
      const handlerWithContext = context
        ? (c: Context) => route.handler(c, context)
        : route.handler;

      const middlewares = [
        ...(route.protected ? [requireAuth] : []),
        ...(route.middleware || []),
      ];

      switch (route.method) {
        case "GET":
          router.get(route.path, ...middlewares, handlerWithContext);
          break;
        case "POST":
          router.post(route.path, ...middlewares, handlerWithContext);
          break;
        case "PUT":
          router.put(route.path, ...middlewares, handlerWithContext);
          break;
        case "DELETE":
          router.delete(route.path, ...middlewares, handlerWithContext);
          break;
        case "PATCH":
          router.patch(route.path, ...middlewares, handlerWithContext);
          break;
      }
    });

    return router;
  }
}

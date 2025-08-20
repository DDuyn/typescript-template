import { Context, Hono } from "hono";

export type RouteHandler<TContext = any> = (
  c: Context,
  context?: TContext
) => Promise<Response> | Response;

export type RouteDefinition<TContext = any> = {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  handler: RouteHandler<TContext>;
  middleware?: any[];
  protected?: boolean;
  public?: boolean;
};

export type FeatureRoutes<TContext = any> = {
  basePath: string;
  routes: RouteDefinition<TContext>[];
  context?: TContext;
  middleware?: any[];
};

export class RouteRegistry {
  private features = new Map<string, FeatureRoutes>();
  private globalMiddleware: any[] = [];

  use(middleware: any) {
    this.globalMiddleware.push(middleware);
    return this;
  }

  registerFeature<T>(name: string, featureRoutes: FeatureRoutes<T>) {
    this.features.set(name, featureRoutes);
    return this;
  }

  buildRouter(): Hono {
    const app = new Hono();

    this.globalMiddleware.forEach((middleware) => {
      app.use("*", middleware);
    });

    this.features.forEach((feature, name) => {
      const featureRouter = this.buildFeatureRouter(feature);
      app.route(feature.basePath, featureRouter);
    });

    return app;
  }

  private buildFeatureRouter<T>(feature: FeatureRoutes<T>): Hono {
    const router = new Hono();

    if (feature.middleware) {
      feature.middleware.forEach((middleware) => {
        router.use("*", middleware);
      });
    }

    feature.routes.forEach((route) => {
      const middlewares = route.middleware || [];

      if (route.protected) {
        middlewares.unshift();
      }

      const handlerWithContext = feature.context
        ? (c: Context) => route.handler(c, feature.context)
        : route.handler;

      this.registerRoute(
        router,
        route.method,
        route.path,
        middlewares,
        handlerWithContext
      );
    });

    return router;
  }

  private registerRoute(
    router: Hono,
    method: string,
    path: string,
    middlewares: any[],
    handler: any
  ) {
    switch (method) {
      case "GET":
        router.get(path, ...middlewares, handler);
        break;
      case "POST":
        router.post(path, ...middlewares, handler);
        break;
      case "PUT":
        router.put(path, ...middlewares, handler);
        break;
      case "DELETE":
        router.delete(path, ...middlewares, handler);
        break;
      case "PATCH":
        router.patch(path, ...middlewares, handler);
        break;
    }
  }

  injectMiddleware(name: string, middleware: any) {
    const feature = this.features.get(name);
    if (feature) {
      feature.routes.forEach((route) => {
        if (route.protected && !route.middleware?.includes(middleware)) {
          route.middleware = route.middleware || [];
          route.middleware.unshift(middleware);
        }
      });
    }
  }
}

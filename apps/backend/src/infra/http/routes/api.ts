import { createAuthRouter } from "@features/auth/infra/auth.routes";
import { Hono } from "hono";

const api = new Hono();

api.route("/auth", createAuthRouter());

export { api };

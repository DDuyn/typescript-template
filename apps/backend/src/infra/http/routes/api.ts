import { authComposition } from "@features/auth/infra/auth.composition";
import { Hono } from "hono";

const api = new Hono();

api.route("/auth", authComposition());

export { api };

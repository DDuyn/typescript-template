import { buildAuthComposition } from "@features/auth/infra/auth.composition";
import { Hono } from "hono";

const api = new Hono();

const authRouter: Hono = buildAuthComposition().resolveSync("authRouter");

api.route("/auth", authRouter);

export { api };

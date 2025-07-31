import { authRouter } from "@domain/auth/auth.router";
import { Hono } from "hono";

const api = new Hono();

api.route("/auth", authRouter);

export { api };

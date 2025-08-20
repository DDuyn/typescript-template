import { Hono } from "hono";

const api = new Hono();

const authRouter = await createAuthRouter();

api.route("/auth", authRouter);

export { api };

import { Hono } from "hono";
import { loginHandler } from "./features/login/login.handler";
import { logoutHandler } from "./features/logout/logout.handler";

const authRouter = new Hono();

authRouter.post("/login", loginHandler);
authRouter.post("/logout", logoutHandler);

export { authRouter };

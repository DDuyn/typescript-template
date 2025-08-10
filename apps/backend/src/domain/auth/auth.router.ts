import { Hono } from "hono";
import { loginHandler } from "./features/login/login.handler";
import { logoutHandler } from "./features/logout/logout.handler";
import { recoverPasswordHandler } from "./features/recover-password/recover-password.handler";
import { signupHandler } from "./features/signup/signup.handler";

const authRouter = new Hono();

authRouter.post("/login", loginHandler);
authRouter.post("/logout", logoutHandler);
authRouter.post("/recover-password", recoverPasswordHandler);
authRouter.post("/signup", signupHandler);

export { authRouter };

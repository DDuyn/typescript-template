import { requireAuth } from "@infra/http/middleware/auth.middleware";
import { Hono } from "hono";
import { loginHandler } from "../api/login/login.handler";
import { logoutHandler } from "../api/logout/logout.handler";
import { recoverPasswordHandler } from "../api/recover-password/recover-password.handler";
import { signupHandler } from "../api/signup/signup.handler";
import { createAuthContext } from "./auth.composition";

export function createAuthRouter(): Hono {
  const router = new Hono();
  const authContext = createAuthContext();

  router.post("/login", (c) => loginHandler(c, authContext));
  router.post("/signup", (c) => signupHandler(c, authContext));
  router.post("/recover-password", (c) =>
    recoverPasswordHandler(c, authContext)
  );

  router.post("/logout", requireAuth, (c) => logoutHandler(c, authContext));

  return router;
}

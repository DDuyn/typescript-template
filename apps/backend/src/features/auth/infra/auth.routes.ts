import { recoverPasswordHandler } from "@domain/auth/features/recover-password/recover-password.handler";
import { signupHandler } from "@domain/auth/features/signup/signup.handler";
import { RouteDefinition } from "@infra/http/routes/route-builder";
import { loginHandler } from "../api/login/login.handler";
import { logoutHandler } from "../api/logout/logout.handler";

export const authRoutes: RouteDefinition[] = [
  {
    method: "POST",
    path: "/login",
    handler: loginHandler,
    protected: false,
  },
  {
    method: "POST",
    path: "/logout",
    handler: logoutHandler,
    protected: true,
  },
  {
    method: "POST",
    path: "/signup",
    handler: signupHandler,
    protected: false,
  },
  {
    method: "POST",
    path: "/recover-password",
    handler: recoverPasswordHandler,
    protected: false,
  },
];

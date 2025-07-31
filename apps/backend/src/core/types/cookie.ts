export const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "Strict" as const,
  maxAge: 60 * 60 * 24 * 7,
  path: "/api",
};

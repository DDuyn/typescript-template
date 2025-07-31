import { z } from "zod";

export const recoverPasswordRequestSchema = z.object({
  email: z.email().nonempty(),
});

export type RecoverPasswordRequest = z.infer<
  typeof recoverPasswordRequestSchema
>;

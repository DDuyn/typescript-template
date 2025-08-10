import z from "zod";

export const signupRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export type SignupRequest = z.infer<typeof signupRequestSchema>;

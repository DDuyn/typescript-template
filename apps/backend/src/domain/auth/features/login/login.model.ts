import z from "zod";

export const loginRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export type LoginDto = {
  accessToken: string;
  refreshToken: string;
  expires_in: number | null;
  userId: string;
  email: string;
  isAdmin: boolean;
};
